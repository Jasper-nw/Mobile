const express = require("express");

const mysql = require("mysql");

const bodyParser = require("body-parser");

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "tourism_mobile",
  connectionLimit: 15,
});
const cors = require("cors");
const server = express();
server.use(bodyParser());
server.use(
  cors({
    origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
  })
);

// 注册
server.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let phone = req.body.phone;
  let sql = "INSERT INTO user (uname,upwd,email,tel) VALUES (?,?,?,?)";
  pool.query(sql, [username, password, email, phone], (err, results) => {
    if (err) throw err;
    res.send("注册成功");
  });
});
// // 注册查看是否存在用户名
// server.post('/check',(req,res)=>{
//     let username = req.body.username;
//     // console.log('aa'+username+'aa')
//     let sql = 'SELECT * from h_user  WHERE username = ?'
//     pool.query(sql,[username],(err,results)=>{
//         if (err) throw err;
//         // console.log(results)
//         res.send({results:results})
//     })
// })
// 登录
server.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let sql = "SELECT * from user WHERE uname = ?";
  let sql2 = "SELECT * from user WHERE uname = ? AND upwd = ?";
  pool.query(sql, [username], (err, results) => {
    if (err) throw err;
    // console.log(results)
    if (results.length == 0) {
      res.send({ code: 0 });
    } else {
      pool.query(sql2, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length == 0) {
          res.send({ code: 1 });
        } else {
          res.send(results);
        }
      });
    }
  });
});

// 商品页面
server.get("/shop", (req, res) => {
  let id = req.query.id;
  let sql = "SELECT * from shop WHERE position = ?";
  pool.query(sql, [id], (err, results) => {
    if (err) throw err;
    res.send(results);
    // console.log(results)
  });
});

// 首页 中 商品
server.post("/join", (req, res) => {
  let user_id = req.body.uid;
  let count = req.body.num;
  let shop_id = req.body.pid;

  let sql = "SELECT * from cart WHERE shop_id=? and user_id=?";
  pool.query(sql, [shop_id, user_id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      let sql =
        "update cart  set count = count+?  where  shop_id=? and user_id=? ";
      pool.query(sql, [count, shop_id, user_id], (err, results) => {
        if (err) throw err;
        res.send({ code: 200 });
      });
    } else {
      let sql = "INSERT INTO cart (shop_id,user_id,count) values(?,?,?)";
      pool.query(sql, [shop_id, user_id, count], (err, results) => {
        if (err) throw err;
        console.log(1);
        res.send({ code: 200 });
      });
    }
  });
});

server.get("/page", (req, res) => {
  let id = req.query.id;
  console.log(id);
  let sql = "SELECT * from list WHERE type = ?";
  pool.query(sql, [id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
//获取商品信息列表
server.get("/list", (req, res) => {
  let sid = req.query.sid;
  let sql = "SELECT * from list WHERE list.id = ?";
  pool.query(sql, [sid], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
// // 获取产品页中部
// server.get('/product4',(req,res)=>{
//     let sql = 'SELECT * from ocean_list WHERE type = 4'
//     pool.query(sql,(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })
// // 获取产品页右侧
// server.get('/product5',(req,res)=>{
//     let sql = 'SELECT * from ocean_list WHERE type = 5'
//     pool.query(sql,(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })
// // 获取即将上市
// server.get('/coming',(req,res)=>{
//     let sql = 'SELECT * from ocean_list WHERE type = 2'
//     pool.query(sql,(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })
// // 获取详情页
// server.get('/articlei',(req,res)=>{
//     let id=req.query.id
//     let sql = 'SELECT * from ocean_list WHERE id = ?'
//     pool.query(sql,[id],(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })
// // 添加到购物车
// server.get('/add',(req,res)=>{
//     let username = req.query.username;
//     let listid = req.query.listid
//     let conut = req.query.conut
//     let sql = 'INSERT INTO shop_car (user_name,list_id,conut) VALUES (?,?,?)';
//     pool.query(sql,[username,listid,conut],(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })
// 获取购物车的信息
server.get("/cart", (req, res) => {
  let uid = req.query.uid;
  console.log(uid);
  let sql =
    "SELECT list.id,list.name,list.newprice,list.img,list.type,cart.id,cart.shop_id,cart.user_id,cart.count FROM list join cart on list.id = cart.shop_id WHERE cart.user_id=?";
  pool.query(sql, [uid], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
// // 删除购物车信息
// server.get('/del',(req,res)=>{
//     let id = req.query.carid;
//     let sql = 'DELETE FROM shop_car WHERE id = ?'
//     pool.query(sql,[id],(err,results)=>{
//         if(err) throw err;
//         res.send("删除成功")
//     })
// })
// //修改购物车数量
// server.get('/update',(req,res)=>{
//     let id = req.query.carid;
//     let conut = req.query.conut;
//     let sql = 'UPDATE shop_car SET conut = ? WHERE id = ?'
//     pool.query(sql,[conut,id],(err,results)=>{
//         if(err) throw err;
//         // console.log('执行了一次')
//         res.send('修改成功')
//     })
// })
// // 模糊查询
// server.get('/search',(req,res)=>{
//     let id = req.query.id;
//     let sql = 'SELECT * from ocean_list WHERE name LIKE ?'
//     pool.query(sql,["%"+id+"%"],(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })
// server.get('/luobotu',(req,res)=>{
//     let sql = 'SELECT src from ocean_list WHERE type = 6'
//     pool.query(sql,(err,results)=>{
//         if(err) throw err;
//         res.send(results)
//     })
// })

server.listen(3000, () => {
  console.log("服务器启动...");
});
