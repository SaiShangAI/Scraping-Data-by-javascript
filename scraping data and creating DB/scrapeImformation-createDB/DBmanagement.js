var mysql = require('mysql');
var con;
var SqlString = require("sqlstring");
var jr = require("./JSONReader.js");

// connect MYSql 

module.exports.connection = function (callback) {
    con = mysql.createConnection({
        host: 'localhost',
        database: 'vacummcleaner',
        user: 'root',
        password: '',
        port: 3306,
        multipleStatements: true
    });
    con.connect(function (err) {
        if (err) {
            console.error('Connect error, Do you open the XAMPP?');
            return;
        } else {
            console.log("Connect sucessful");
            if (callback) {
                callback();
            }
        }
    });

};

// create table with any head 
module.exports.createTableAndHead = function (name, heads, headlengths, callback) {
    var primary_name = 'pk_' + name + '_id';
    var sql = "Create Table "+ name + '(';
    sql = sql + SqlString.format('??int NOT NULL AUTO_INCREMENT,PRIMARY KEY (??)', [primary_name, primary_name]);

    for (var key in heads) {
        sql = sql + ',';
        var value = '`' + heads[key] + '`';
        var length = headlengths[key];
        sql = sql + value + ' varchar(' + length.toString() + ')';
    }
    sql = sql + ")";

    con.query(sql, function (err) {
        if (err) {
            console.log("create table failed" + err.message);
            dropSql = SqlString.format("DROP TABLE?? ;", [name]);
            var addNewTable = dropSql + sql;
            con.query(addNewTable, function (err) {
                if (err) {
                    console.log("create table failed" + err.message);
                }
                else {
                    console.log("create NewTable sussesful");

                }
            });

        } else {
            console.log("crate table sussesful");

        }

        if (callback) {
            callback();
        }
    });

}
// insert information into table
module.exports.insertAny = function (tableName, keyValue, header, counter, callback) {
    var sql = "INSERT INTO " + tableName + ' (';
    for (var key in header) {
        var value = header[key];
        sql += '`' + value + '`';
        sql += ',';
    }
    sql = sql.substring(0, sql.length - 1);
    sql = sql + ') VALUES (';

    for (var key in header) {
        var value = header[key];
        if (keyValue.hasOwnProperty(value)) {
            sql = sql + SqlString.escape(keyValue[value]);
        } else {
            sql = sql + 'NULL';
        }

        sql = sql + ',';
    }
    sql = sql.substring(0, sql.length - 1);
    sql += ")";
    con.query(sql, function (err) {
        if (err) {
            console.log("insert data failed" + "product" + counter + err.message);
        } else {
            console.log("insert data sussesful");
            if (callback) {
                callback();
            }
        }
    });
}




// create table and insert value
module.exports.OperateTable = function OperateTable(tablename, GetProductInforFunction) {
    // get head
    var [jsonContent, jsonContentLength] = jr.Read('json2.json');

    // get product detail
    var allInfo = [];
    for (var i = 0; i < jsonContentLength; i++) {
        var product = jr.GetProduct(jsonContent, i);
        var infor = GetProductInforFunction(product, i);
        allInfo.push(infor);
    }
    var [allHead, headLength] = jr.GetAttributeHead(allInfo);

    //insert data
    var insertData = function () {

        for (var key in allInfo) {

            var oneProduct = allInfo[key];
            module.exports.insertAny(tablename, oneProduct, allHead, key,
                function () {

                });
        }
    }

    //create table with tableHead
    var createHead = function () {

        module.exports.createTableAndHead(tablename, allHead, headLength, insertData);
    }

    module.exports.connection(createHead);

}











