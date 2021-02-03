const express = require('express');
let { checkUserToken } = require('../../middlewares/authentication');
const Client = require('../../models/client');
const Store = require('../../models/store');
const User = require('../../models/user');
const { sendMail } = require('../../utils/mail');
const sql = require('mssql');
const router = express.Router();

router.post('/register/client', checkUserToken, async(req, res) => {
    let body = req.body;
    let client_insert;
    try {
        switch (req.store.store_type) {
            case 'FrontRetail/Manager':
                client_insert = await sendClientToFRTFRSManager(req.store, body);
                await saveClient(client_insert, req.store, body, req.files, res);
                break;
            case 'FrontRetail':
                client_insert = await sendClientToFRTFRSManager(req.store, body);
                await saveClient(client_insert, req.store, body, req.files, res);
                break;
            case 'FrontRest/Manager':
                client_insert = await sendClientToFRTFRSManager(req.store, body);
                await saveClient(client_insert, req.store, body, req.files, res);
                break;
            case 'FrontRest':
                client_insert = await sendClientToFRTFRSManager(req.store, body);
                await saveClient(client_insert, req.store, body, req.files, res);
                break;
            case 'Manager':
                client_insert = await sendClientToFRTFRSManager(req.store, body);
                await saveClient(client_insert, req.store, body, req.files, res);
                break;
            case 'Agora':
                client_insert = await sendClientToAgora(req.store, body);
                await saveClient(client_insert, req.store, body, req.files, res);
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    message: 'Bad store type',
                    type: 24
                });
        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err: err,
            type: 1
        });
    }
});

saveClient = async(client_insert, store, body, files, res) => {
    sql.close();
    try {
        switch (client_insert) {
            case 0:
                let client = new Client({
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    invoice_details: body.invoice_detail,
                    store: store
                });
                const existingClient = await Client.find({
                    email: body.email,
                    phone: body.phone,
                    store: store
                });
                if (existingClient.length === 0) {
                    if (files) {
                        const response = await addSignature(client, res, files.signature);
                        // let response = { ok: true, clientDB: client };
                        if (!response.ok) {
                            return res.status(400).json({
                                ok: false,
                                message: response.error,
                                type: 16
                            });
                        } else {
                            client = response.clientDB;
                        }
                    }
                    const savedClient = await client.save();
                    // let savedClient = true;
                    if (savedClient) {
                        const user = await User.findById(store.user);
                        addToLog('info', `Client "${client.name}" created by store "${store.name}"`);
                        const mail = await sendMail(store, client, user);
                        // const mail = true;
                        return res.status(200).json({
                            ok: true,
                            message: 'Client inserted',
                            type: 23
                        });
                    } else {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error saving client',
                            type: 16
                        });
                    }
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'Client already exists',
                        type: 16
                    });
                }
            case 1:
                return res.status(400).json({
                    ok: false,
                    message: 'Client already exists',
                    type: 16
                });
            case 2:
                return res.status(400).json({
                    ok: false,
                    message: 'Bad SQL statement',
                    type: 17
                });
            case 3:
                return res.status(400).json({
                    ok: false,
                    message: 'Unable to connect with database server',
                    type: 18
                });
            default:
                return res.status(500).json({
                    ok: false,
                    message: 'Server error',
                    type: 1
                });
        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: 'Server error',
            err: err,
            type: 1
        });
    }
};

sendClientToFRTFRSManager = async(connection_params, client) => {
    const config = {
        user: connection_params.database_username,
        password: connection_params.database_password,
        server: connection_params.database_url,
        port: connection_params.database_port,
        database: connection_params.database_name,
        commerce_password: connection_params.commerce_password
    };

    try {
        const connection = await sql.connect(
            `mssql://${config.user}:${config.password}@${config.server}:${config.port}/${config.database}`
        );
        if (connection) {
            const result = await sql.query `SELECT * from CLIENTES where (E_MAIL = ${client.email}) OR (TELEFONO1 = ${client.phone})`;
            let max_id;
            if (connection_params.store_type = 'FrontRest/Manager') {
                max_id = (await sql.query `SELECT MAX(CODCLIENTE) + 1 as ID from CLIENTES`).recordset[0].ID
            } else {
                max_id = (await sql.query `select
				case ISNULL(MAX(CODCLIENTE)+1,0)
				when 0 then (select VALOR from PARAMETROS where CLAVE='CONT' and SUBCLAVE='MINIM' and USUARIO=1)
				else ISNULL(MAX(CODCLIENTE)+1,0)
				end as ID
				FROM CLIENTES WITH(SERIALIZABLE, UPDLOCK)
				where
				CODCLIENTE <= (select VALOR from PARAMETROS where CLAVE='CONT' and SUBCLAVE='MAXIM' and USUARIO=1) and
				CODCLIENTE >= (select VALOR from PARAMETROS where CLAVE='CONT' and SUBCLAVE='MINIM' and USUARIO=1)`).recordset[0].ID;
            }

            const client_account = (parseFloat(4300000000) + parseFloat(max_id)).toString();
            if (result.recordset.length === 0) {
                let query;
                if (client.invoice_detail) {
                    query = await sql.query `insert into CLIENTES (CODCLIENTE, NOMBRECLIENTE, NOMBRECOMERCIAL, CODCONTABLE, E_MAIL, TELEFONO1, REGIMFACT, CODMONEDA, PASSWORDCOMMERCE, CIF, DIRECCION1, POBLACION, PROVINCIA, CODPOSTAL) values (${max_id}, ${client.name}, ${client.name}, ${client_account}, ${client.email}, ${client.phone}, 'G', '1', ${config.commerce_password}, ${client
                        .invoice_detail.cif}, ${client.invoice_detail.address}, ${client.invoice_detail.city}, ${client
                        .invoice_detail.province}, ${client.invoice_detail.zip_code})`;
                } else {
                    query = await sql.query `insert into CLIENTES (CODCLIENTE, NOMBRECLIENTE, NOMBRECOMERCIAL, CODCONTABLE, E_MAIL, TELEFONO1, REGIMFACT, CODMONEDA, PASSWORDCOMMERCE) values (${max_id}, ${client.name}, ${client.name}, ${client_account}, ${client.email}, ${client.phone}, 'G', '1', ${config.commerce_password})`;
                }
                if (query.code === 'EREQUEST') {
                    /* Bad SQL statement */
                    return 2;
                }
                if (query.rowsAffected[0] === 1) {
                    /* Client inserted */
                    if (connection_params.store_type in ['FrontRetail/Manager', 'FrontRest/Manager']) {
                        const sql_string_rem_transactions = `insert into REM_TRANSACCIONES (TERMINAL, CAJA, CAJANUM, Z, TIPO, ACCION, SERIE, NUMERO, FO, IDCENTRAL, TALLA, COLOR) values (CAST(SERVERPROPERTY('COMPUTERNAMEPHYSICALNETBIOS') AS NVARCHAR(40)), '001',0, 1, 12, 0, '', ${client_id}, 0, 1, '.','.')`;
                        const rem_transactions = await sql.query(sql_string_rem_transactions);
                        if (rem_transactions.rowsAffected[0] <= 0) {
                            return 2;
                        }
                    }

                    if (connection_params.store_type === 'Manager' && connection_params.database_name === 'FIMSBURY') {
                        const sql_string_client_tariff = `insert into TARIFASCLIENTE (CODCLIENTE, IDTARIFAV, DESCRIPCION, POSICION, DTO, CODPROVEEDOR, CODEXTERNO) values (${max_id}, 2, 'TARIFA CLIENTES', 1,  0, 0, '' )`;
                        const client_tariff = await sql.query(sql_string_client_tariff);
                        if (client_tariff.rowsAffected[0] <= 0) {
                            return 2;
                        }
                    }

                    if (client.freeFields.length >= 0) {
                        const result = await saveFreeFields(max_id, client.freeFields);
                        if (result) {
                            return 0;
                        } else {
                            return 2;
                        }
                    }
                }
            } else {
                /* Client already exists */
                return 1;
            }
        } else {
            /* Error connecting to SQL server */
            return 3;
        }
    } catch (err) {
        console.log(err);
        if (err.code === 'ESOCKET') {
            return 3;
        } else {
            /* Server error */
            return 4;
        }
    }
};

sendClientToAgora = async(connection_params, client) => {
    sql.close();
    const config = {
        user: connection_params.database_username,
        password: connection_params.database_password,
        server: connection_params.database_url,
        port: connection_params.database_port,
        database: connection_params.database_name,
        commerce_password: connection_params.commerce_password
    };

    try {
        const connection = await sql.connect(
            `mssql://${config.user}:${config.password}@${config.server}:${config.port}/${config.database}`
        );
        if (connection) {
            const result = await sql.query `SELECT * from CUSTOMER where (EMAIL = ${client.email}) OR (TELEPHONE = ${client.phone})`;
            const max_id = (await sql.query `select ISNULL(MAX(ID)+1,0) as ID FROM CUSTOMER WITH (SERIALIZABLE, UPDLOCK)`)
                .recordset[0].ID;
            if (result.recordset.length === 0) {
                let query;
                if (client.invoice_detail) {
                    query = await sql.query `insert into CUSTOMER (ID, FISCALNAME, CIF, BUSINESSNAME, TELEPHONE, EMAIL, CONTACTPERSON, DISCOUNTRATE, SENDMAILING, APPLYSURCHARGE, SHOWNOTES, NOTES, STREET, CITY, REGION, ZIPCODE, ACCOUNTCODE) values (${max_id}, ${client.name}, ${client
                        .invoice_detail.cif ||
                        ''}, ${client.name}, ${client.phone}, ${config.email}, ${client.name}, 0.00, 1, 0, 0, '', ${client
                        .invoice_detail.address || ''}, ${client.invoice_detail.city || ''}, ${client.invoice_detail
                        .province || ''}, ${client.invoice_detail.zip_code || ''}, '')`;
                } else {
                    query = await sql.query `insert into CUSTOMER (ID, FISCALNAME, BUSINESSNAME, TELEPHONE, EMAIL, CONTACTPERSON, DISCOUNTRATE, SENDMAILING, APPLYSURCHARGE, SHOWNOTES, NOTES, STREET, CITY, REGION, ZIPCODE, ACCOUNTCODE) values (${max_id}, ${client.name}, ${client.name}, ${client.phone}, ${client.email}, ${client.name}, 0.00, 1, 0, 0, '', '', '', '', '', '')`;
                }

                if (query.code === 'EREQUEST') {
                    /* Bad SQL statement */
                    return 2;
                }
                if (query.rowsAffected[0] === 1) {
                    /* Client inserted */
                    return 0;
                }
            } else {
                /* Client already exists */
                return 1;
            }
        } else {
            /* Error connecting to SQL server */
            return 3;
        }
    } catch (err) {
        if (err.code === 'ESOCKET') {
            return 3;
        } else {
            /* Server error */
            return 4;
        }
    }
};

saveFreeFields = async(client_id, free_fields) => {
    const ff = JSON.parse(free_fields);
    let sql_string = '';
    if (ff.length > 0) {
        for (let i = 0; i < ff.length; i++) {
            if (ff[i].selectedValue) {
                if (ff[i].type === 'checkbox') {
                    if (ff[i].selectedValue === true) {
                        sql_string += `${ff[i].name}='T', `;
                    } else {
                        sql_string += `${ff[i].name}='F', `;
                    }
                }
                if (ff[i].type === 'select') {
                    if (ff[i].selectedValue !== null && ff[i].selectedValue !== undefined) {
                        sql_string += `${ff[i].name} = ${ff[i].selectedValue}, `;
                    }
                }
            }
        }
        sql_string = sql_string.slice(0, -2);
        sql_string = `update CLIENTESCAMPOSLIBRES set ${sql_string} where CODCLIENTE = ${client_id}`;
    } else {
        sql_string = '';
    }

    try {
        if (sql_string !== '') {
            const query = await sql.query(sql_string);
            if (query.rowsAffected[0] >= 0) {
                return true;
            } else {
                return false;
            }
        } else {
            const rem_transactions = await sql.query(sql_string_rem_transactions);
            if (rem_transactions.rowsAffected[0] > 0) {
                return true;
            } else {
                return false;
            }
        }
    } catch (err) {
        return {
            ok: false,
            error: 'Error updating free fields'
        };
    }
};

addSignature = async(clientDB, res, signature) => {
    try {
        let file = signature;
        extension = 'png';

        let filename = `${clientDB._id}-${new Date().getMilliseconds() * Math.random()}.${extension}`;
        await file.mv(`uploads/client/signature/${filename}`);

        clientDB.signature = filename;
        return {
            ok: true,
            clientDB
        };
    } catch (err) {
        return {
            ok: false,
            error: 'Error moving signature file'
        };
    }
};

module.exports = router;