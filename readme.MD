# Angular - NodeJS test application

### First step: Installing MongoDB

To run this app, first of all you have to install MongoDB in your system:

#### On Mac/OSX:

``` brew update ```

and then:

``` brew install mongodb ```


Once installed, create the data directory:

``` mkdir -p /data/db ```

And run the mongoDB service:

``` mongod ```

(Also make sure that the user who runs 'mongod' command has permissions to read/write the data folder. You can run both commands as root to avoid errors)

If everything goes fine, you will see this output after running 'mongod' command:

``` [initandlisten] waiting for connections on port 27017 ```

That's the port in which mongoDB is listeing for queries....

#### On Windows:

Follow the MongoDB page instructions: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mdb-edition

#### On Linux:

Follow the MongoDB page instructions: https://docs.mongodb.com/manual/administration/install-on-linux/


#

### Second step: Installing NodeJS

The next part is setting up the backend server:

Go to the backend's root folder and run the following command:

``` npm install ```

After npm finishes, just run:

``` npm start ```

#

### Third step: Installing Angular

The final step is running the frontend.

The first thing is install Angular CLI:

``` npm install -g @angular/cli ```

(Maybe, you should execute this command as root)

After that, go to the frontend folder and run:

``` npm install ```

Once finished, just run:

``` ng serve ```

#


Database is listening in the port: 27017\
Backend server is listening in the port: 3000\
Frontend app is listening in the port: 4200
