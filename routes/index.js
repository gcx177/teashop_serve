var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var User = require('../db/userSql.js');
var QcloudSms = require("qcloudsms_js");
const { upload } = require('../utils/index.js')
const jwt = require('jsonwebtoken');



router.get('/api/tab', function(req, res, next) {
  res.send({
    code: 0,
    data: [
      {id: 1, label: '推荐'},
      {id: 2, label: '金骏眉'},
      {id: 3, label: '大红袍'},
      {id: 4, label: '龙井'},
      {id: 5, label: '白茶'},
      {id: 6, label: '普洱'},
      {id: 7, label: '正山小种'}
    ]
  });
});


router.get('/api/teaTab', function(req, res, next) {
  res.send({
    code: 0,
    data: [
      {id: 1, label: '金骏眉'},
      {id: 2, label: '大红袍'},
      {id: 3, label: '龙井'},
      {id: 4, label: '白茶'},
      {id: 5, label: '普洱'},
      {id: 6, label: '正山小种'}
    ]
  });
});

// 查询商品的接口
router.get('/api/goods/shopList', function(req, res, next) {

  // 前端给后端的数据
  let searchName = req.query.searchName

  // 查询语句
  let sql = 'select * from goods_list where name like "%' + searchName +'%"';
  connection.query(sql, function(err, result) {
    res.send({
      code: 0,
      data: result
    })
  });
});

// 查询所有商品的接口
router.get('/api/goods/alllist', function(req, res, next) {

  // 查询语句
  let sql = 'select * from goods_list';
  connection.query(sql, function(err, result) {
    res.send({
      code: 0,
      data: result
    })
  });
});


// 商品分类的接口
router.get('/api/goods/lists', function(req, res, next) {

  res.send({
    code: 0,
    data: [
      {id: 1, name: '推荐', children: [
        {id: 11, name: '铁观音', imgUrl: '../images/fenlei/tuijian/product1.jpeg'},
        {id: 12, name: '金骏眉', imgUrl: '../images/fenlei/tuijian/product2.jpeg'},
        {id: 13, name: '武夷岩茶', imgUrl: '../images/fenlei/tuijian/product3.jpeg'},
        {id: 14, name: '龙井', imgUrl: '../images/fenlei/tuijian/product4.jpeg'},
        {id: 15, name: '云南滇红', imgUrl: '../images/fenlei/tuijian/product5.jpeg'}
      ]},
      {id: 2, name: '绿茶', children: [
        {id: 21, name: '龙井', imgUrl: '../images/fenlei/lvcha/product1.jpeg'},
        {id: 22, name: '黄山毛峰', imgUrl: '../images/fenlei/lvcha/product2.jpeg'},
        {id: 23, name: '碧螺春', imgUrl: '../images/fenlei/lvcha/product3.jpeg'},
        {id: 24, name: '雀舌', imgUrl: '../images/fenlei/lvcha/product4.png'},
        {id: 25, name: '太平猴魁', imgUrl: '../images/fenlei/lvcha/product5.jpeg'},
        {id: 26, name: '安吉白茶', imgUrl: '../images/fenlei/lvcha/product6.png'},
        {id: 27, name: '六安瓜片', imgUrl: '../images/fenlei/lvcha/product7.png'}
      ]},
      {id: 3, name: '乌龙', children: [
        {id: 31, name: '铁观音', imgUrl: '../images/fenlei/wulong/product1.jpeg'},
        {id: 32, name: '武夷岩茶', imgUrl: '../images/fenlei/wulong/product2.jpeg'},
        {id: 33, name: '漳平水仙', imgUrl: '../images/fenlei/wulong/product3.jpeg'}
      ]},
      {id: 4, name: '红茶', children: [
        {id: 41, name: '金骏眉', imgUrl: '../images/fenlei/hongcha/product1.jpeg'},
        {id: 42, name: '正山小种', imgUrl: '../images/fenlei/hongcha/product2.jpeg'},
        {id: 43, name: '云南滇红', imgUrl: '../images/fenlei/hongcha/product3.jpeg'},
        {id: 44, name: '祁门红茶', imgUrl: '../images/fenlei/hongcha/product3.jpeg'}
      ]},
      {id: 5, name: '白茶', children: [
        {id: 51, name: '白牡丹', imgUrl: '../images/fenlei/baicha/product1.jpeg'},
        {id: 52, name: '牡丹王', imgUrl: '../images/fenlei/baicha/product2.jpeg'},
        {id: 53, name: '白毫银针', imgUrl: '../images/fenlei/baicha/product3.jpeg'},
        {id: 54, name: '寿眉', imgUrl: '../images/fenlei/baicha/product3.jpeg'}
      ]},
      {id: 6, name: '普洱', children: [
        {id: 61, name: '生茶', imgUrl: '../images/fenlei/puer/product1.jpeg'},
        {id: 62, name: '熟茶', imgUrl: '../images/fenlei/puer/product2.jpeg'}
      ]},
      {id: 7, name: '花茶', children: [
        {id: 71, name: '茉莉花茶', imgUrl: '../images/fenlei/huacha/product1.jpeg'}
      ]}
    ]
  })
  
});

// 查询某个商品的详细信息
router.get('/api/goods/detail', function(req, res, next) {

  let id = req.query.id
  
  // 查询语句
  let sql = 'select * from goods_detail where id = ' + id;
  connection.query(sql, function(err, result) {

    res.send({
      code: 0,
      data: result
    })
  });
});

// 用户登录
router.post('/api/login', function(req, res, next) {

    let params = {
      username: req.body.username,
      password: req.body.password
    }
    // 查询用户手机号是否存在
    connection.query(User.queryUserTel(params), function(error, result) {
      // 手机号存在
      if(result.length > 0) {

        connection.query(User.queryUserPwd(params), function(error, rest) {
          if(rest.length > 0) {
            // 手机号和密码都正确
            res.send({
              code: 200,
              data: {
                success: true,
                message: '登录成功',
                data: rest[0]
              }
            })
          } else {
            res.send({
              code: 302,
              data: {
                success: false,
                message: '密码错误'
              }
            })
          }
        });

      } else {
        res.send({
          code: 301,
          data: {
            success: false,
            message: '手机号不存在'
          }
        })
      }
    });
});


// 验证码登录
router.post('/api/code', function(req, res, next) {

  let tel = req.body.phone;
	
	// 短信应用SDK AppID
	var appid = 1400187558;  // SDK AppID是1400开头
	
	// 短信应用SDK AppKey
	var appkey = "dc9dc3391896235ddc2325685047edc7";
	
	// 需要发送短信的手机号码
	var phoneNumbers = [tel];
	
	// 短信模板ID，需要在短信应用中申请
	var templateId = 285590;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
	
	// 签名
	var smsSign = "三人行慕课";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`
	
	// 实例化QcloudSms
	var qcloudsms = QcloudSms(appid, appkey);
	
	// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
	function callback(err, ress, resData) {
	    if (err) {
	        console.log("err: ", err);
	    } else {
        res.send({
          code:200,
          data:{
            success:true,
            // 返回短信验证码
            data:ress.req.body.params[0]
          }
        })
	    }
	}
	
	var ssender = qcloudsms.SmsSingleSender();
	//这个变量：params 就是往手机上，发送的短信
	var params = [  Math.floor( Math.random()*(9999-1000))+1000   ];
	ssender.sendWithParam(86, phoneNumbers[0], templateId,
	  params, smsSign, "", "", callback);  // 签名参数不能为空串
  
});

// 增加一个用户
router.post('/api/addUser', function(req, res, next) {
  let tel = {
    username: req.body.phone
  }

  connection.query(User.queryUserTel(tel), function(error, rest) {
    if(error) throw error;

    // 用户存在
    if(rest.length > 0) {
      res.send({
        code:200,
        data:{
          success:true,
          message: '登录成功',
          data: rest[0]
        }
      })
    } else {
      // 不存在， 新增一条数据
      connection.query(User.inserData(tel), function(err, result) {
        connection.query(User.queryUserTel(tel), function(e, r) {
          res.send({
            code:200,
            data:{
              success:true,
              message: '登录成功',
              data: r[0]
            }
          })
        });
      });
    }
  })
});



// 注册一个用户
router.post('/api/register', function(req, res, next) {
  let tel = {
    username: req.body.phone,
    password: req.body.password
  }

  connection.query(User.queryUserTel(tel), function(error, rest) {
    if(error) throw error;

    // 用户存在
    if(rest.length > 0) {
      res.send({
        code:404,
        data:{
          success:false,
          message: '该账户已存在，请直接登录'
        }
      })
    } else {
      // 不存在， 新增一条数据(携带密码)
      connection.query(User.inserDataForPwd(tel), function(err, result) {
        connection.query(User.queryUserTel(tel), function(e, r) {
          res.send({
            code:200,
            data:{
              success:true,
              message: '注册成功',
              data: r[0]
            }
          })
        });
      });
    }
  })
});

// 查询用户是否存在
router.post('/api/selectUser', function(req, res, next) {

  let tel = {
    username: req.body.phone
  }

  connection.query(User.queryUserTel(tel), function(error, rest) {
    if(rest.length > 0) {
      res.send({
        code: 200,
        data:{
          success: true
        }
      });
    } else {
      res.send({
        code: 404,
        data:{
          success: false,
          message: '此用户不存在，请先注册'
        }
      });
    }

  });

});


// 找回密码(修改密码)
router.post('/api/recovery', function(req, res, next) {
  let tel = {
    username: req.body.phone,
    password: req.body.password
  }

  connection.query(User.queryUserTel(tel), function(error, rest) {
    let id = rest[0].id
    let pwd = rest[0].pwd

    connection.query(`update user set pwd = replace(pwd,'${pwd}','${tel.password}') where id = ${id}`,function(err,result){
			res.send({
				code:200,
				data:{
					success:true,
					message:'修改成功'
				}
			})
		})
  });

});

// 上传图像
router.post('/api/uploadImg', upload.single('imgUrl'),function(req, res, next) {
  console.log(req.file);
  let imgPath = req.file.path.split('public')[1]
  console.log(imgPath);
  let imgUrl = 'http://localhost:3000' + imgPath

  res.send({
    code:200,
    data:{
      success:true,
      message:'修改成功',
      data: imgUrl
    }
  })
})


// 更新用户昵称和头像
router.post('/api/updateMessage', function(req, res, next) {
  let tel = {
    username: req.body.phone,
    nickname: req.body.nickname,
    imgUrl: req.body.imgUrl
  }

  connection.query(User.queryUserTel(tel), function(error, rest) {
    let id = rest[0].id

    connection.query(`update user set imgUrl = '${tel.imgUrl}', nickname = '${tel.nickname}' where id = ${id}`,function(err,result){
      console.log(tel.imgUrl);
			res.send({
				code:200,
				data:{
					success:true,
					message:'保存成功'
				}
			})
		})
  });

});

// 添加购物车
router.post('/api/addCart', function(req, res, next) {
  // 后端接收商品的id
  let goodsId = req.body.goodsId
  let token = req.headers.token;


  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)

  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '添加失败'
      }
    })
  } else {
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
  
      // 查询商品
      connection.query(`select * from goods_list where id = ${goodsId}`, function(e,r) {
        let goodsName = r[0].name;
        let goodsPrice = r[0].price;
        let goodsImgUrl = r[0].imgUrl;
  
        // 查询当前用户在之前是否添加过本商品
        connection.query(`select * from goods_cart where user_id = ${uid} and goods_id = ${goodsId}`, function(er,re) {

          if(re.length > 0) {
            let num = re[0]['goods_num']

            // 用户添加过该商品到购物车
            connection.query(`update goods_cart set goods_num = '${parseInt(num)+1}' where goods_id = ${goodsId}`, function(a,b) {})
          } else {
            // 没有就新增
            connection.query(`insert into goods_cart (user_id,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values ("${uid}","${goodsId}","${goodsName}","${goodsPrice}","1","${goodsImgUrl}")`, function(ee,rr) {})
          }
        })

        
        res.send({
          code: 200,
          data: {
            success: true,
            message: '添加成功'
          }
        })

      })
  
    })
  }
  
})

// 查询购物车
router.post('/api/selectCart', function(req, res, next) {

  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '获取购物车数据失败，请先登录'
      }
    })
  } else {
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      // 查询购物车数据
      connection.query(`select * from goods_cart where user_id = ${uid}`, function(e,r) {
        res.send({
          code: 200,
          data: {
            success: true,
            data: r
          }
        })
      })
    })
  }
})


// 删除购物车的某条数据
router.post('/api/deleteCart', function(req, res, next) {
  let goodsIdArr = req.body.goodsId;
  for(let i = 0; i<goodsIdArr.length; i++) {
    connection.query(`delete from goods_cart where id = ${goodsIdArr[i]}`, function(error,result) {
      
    })
  }

  res.send({
    code: 200,
    data: {
      success: true,
      message: '删除成功'
    }
  })

})


// 修改购物车商品的数量
router.post('/api/updateNumber', function(req, res, next) {
  let id = req.body.id
  let num = req.body.num
  connection.query(`update goods_cart set goods_num = '${num}' where id = ${id}`, function(error,result) {
    res.send({
      code: 0,
      data: {
        success: true,
        message: '修改成功'
      }
    })
  })
})


// 获取当前用户购物车总数
router.post('/api/userGoodsNumber', function(req, res, next) {
  let tel = req.query.tel


  connection.query(`select * from user where tel = ${tel}`, function(error,result) {
    // 用户id
    let uid = result[0].id
    connection.query(`select * from goods_cart where user_id = ${uid}`, function(e,r) {

      res.send({
        code: 200,
        data: {
          success: true,
          message: '获取数据成功',
          data: r.length
        }
      })
    })
  })
})

// 新增收货地址
router.post('/api/addAddress', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '无法新增收货地址，请先登录'
      }
    })

  } else {
    let body = req.body;
    let [name, tel, province, city, county, addressDetail, isDefault, areaCode] = [
      body.name, body.tel, body.province, body.city, body.county, body.addressDetail, body.isDefault, body.areaCode
    ]

    // 获取当前用户的id
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      // 新增收货地址
      if(isDefault !== 1) {
        connection.query(`insert into user_address (user_id,name,tel,province,city,county,addressDetail,isDefault,areaCode) values ("${uid}","${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`, function(e,r) {
          res.send({
            code: 200,
            data: {
              success: true,
              message: '收货地址添加成功'
            }
          })
        })
      } else {
        // 如果等于1，把数据库中当前用户其他地址的isDefault设置为0
        // 用户可能之前并没有设置默认地址，因此这种情况也需要进行考虑
        connection.query(`select * from user_address where user_id = ${uid} and isDefault = ${isDefault}`, function(err,rrr) {
          // 说明用户之前有添加默认地址
          if(rrr.length > 0) {
            let addressId = rrr[0].id;
            connection.query(`update user_address set isDefault = '0' where id = ${addressId}`, function(a,b) {
              connection.query(`insert into user_address (user_id,name,tel,province,city,county,addressDetail,isDefault,areaCode) values ("${uid}","${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`, function(e,r) {
                res.send({
                  code: 200,
                  data: {
                    success: true,
                    message: '收货地址添加成功'
                  }
                })
              })
            });
          } else {
            connection.query(`insert into user_address (user_id,name,tel,province,city,county,addressDetail,isDefault,areaCode) values ("${uid}","${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`, function(e,r) {
              res.send({
                code: 200,
                data: {
                  success: true,
                  message: '收货地址添加成功'
                }
              })
            })
          }
        })
      }
    })
  }
})

// 查询收货地址
router.get('/api/selectAddress', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    // 获取当前用户的id
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      // 新增收货地址
      connection.query(`select * from user_address where user_id = ${uid}`, function(e,r) {
        res.send({
          code: 200,
          data: {
            success: true,
            message: '查询成功',
            data: r
          }
        })
      })
    })
  }
})

// 新增收货
router.post('/api/updateAddress', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '无法新增收货地址，请先登录'
      }
    })

  } else {
    let body = req.body;
    let [id, name, tel, province, city, county, addressDetail, isDefault, areaCode] = [
      body.id, body.name, body.tel, body.province, body.city, body.county, body.addressDetail, body.isDefault, body.areaCode
    ]

    // 获取当前用户的id
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id


      let sqlUpdate = `update user_address set name = '${name}', tel = '${tel}', province = '${province}', city = '${city}', county = '${county}', addressDetail = '${addressDetail}', isDefault = '${isDefault}', areaCode = '${areaCode}' where id = ${id} and user_id = ${uid}`
      if(isDefault !== 1) {

        connection.query(sqlUpdate, function(e,r) {
          res.send({
            code: 200,
            data: {
              success: true,
              message: '修改地址成功'
            }
          })
        })
      } else {
        // 与添加地址的代码逻辑基本相似
        connection.query(`select * from user_address where user_id = ${uid} and isDefault = ${isDefault}`, function(err,rrr) {
          // 说明用户之前有添加默认地址
          if(rrr.length > 0) {
            let addressId = rrr[0].id;
            connection.query(`update user_address set isDefault = '0' where id = ${addressId}`, function(a,b) {
              connection.query(sqlUpdate, function(e,r) {
                res.send({
                  code: 200,
                  data: {
                    success: true,
                    message: '收货地址修改成功'
                  }
                })
              })
            });
          } else {
            connection.query(sqlUpdate, function(e,r) {
              res.send({
                code: 200,
                data: {
                  success: true,
                  message: '收货地址修改成功'
                }
              })
            })
          }
        })


      }

    })

  }
})

// 删除地址
router.post('/api/deleteAddress', function(req, res, next) {
  let id = req.body.id;
  connection.query(`delete from user_address where id = ${id}`, function(error,result) {
    res.send({
      code: 200,
      data: {
        success: true,
        message: '删除成功'
      }
    })
  })

})

// 生成一个订单
router.post('/api/addOrder', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    let newarr = req.body.arr

    // 以6位随机数 + 当前时间戳 作为订单号
    let order_id = parseInt(Math.random() * 1000000) + Date.now().toString();

    /*
      订单未结算：1
      订单已结算：2
    */

    // 商品列表名称
    let goodsName = [];
    // 各个商品的数梁
    let goodsNums = [];
    // 各个商品的数梁id
    let goodsId = [];
    // 订单总价
    let goodsPrice = 0;
    // 用户的收货地址
    let goodsAddress = [];

    newarr.forEach(v => {
      goodsName.push(v['goods_name']);
      goodsNums.push(v['goods_num']);
      goodsId.push(v['goods_id']);
      goodsPrice += v['goods_num'] * v['goods_price']
    });

    // 获取当前用户的id
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      // 将用户的地址信息
      // 用户可能没有设置默认地址，如果设置了就使用默认地址，没有设置默认地址就使用当前地址的第一项
      connection.query(`select * from user_address where user_id = ${uid} and isDefault = 1`, function(err,rrr) {
        // 存在默认地址
        if(rrr.length > 0) {
          let address = rrr[0];
          goodsAddress.push(address.name);
          goodsAddress.push(address.tel);
          goodsAddress.push(address.province);
          goodsAddress.push(address.city);
          goodsAddress.push(address.county);
          goodsAddress.push(address.addressDetail);

          connection.query(`insert into store_order (order_id,goods_name,goods_price,goods_num,order_status,goods_id,user_id,goods_address) values ("${order_id}","${goodsName}","${goodsPrice}","${goodsNums}","1","${goodsId}","${uid}","${goodsAddress}")`, function(e,r) {
        
            // 查询当前用户的所有订单并返回
            connection.query(`select * from store_order where user_id = ${uid} and order_id= ${order_id}`, function(ee,rr) {
    
              res.send({
                code: 200,
                data: {
                  success: true,
                  message: '提交订单成功',
                  data: rr // 返回当前订单的订单
                }
              })
    
            })
          })

        } else {
          connection.query(`select * from user_address where user_id = ${uid}`, function(er,rs) {
            // 如果用户之前没有添加收货地址，告诉用户添加收货地址，并返回
            if(rs.length == 0) {
              res.send({
                code: 200,
                data: {
                  success: false,
                  message: '您还没有设置收货地址，请先添加收货地址'
                }
              })
            } else {

              let address = rs[0];
              goodsAddress.push(address.name);
              goodsAddress.push(address.tel);
              goodsAddress.push(address.province);
              goodsAddress.push(address.city);
              goodsAddress.push(address.county);
              goodsAddress.push(address.addressDetail);

              connection.query(`insert into store_order (order_id,goods_name,goods_price,goods_num,order_status,goods_id,user_id,goods_address) values ("${order_id}","${goodsName}","${goodsPrice}","${goodsNums}","1","${goodsId}","${uid}","${goodsAddress}")`, function(e,r) {
        
                // 查询当前用户的所有订单并返回
                connection.query(`select * from store_order where user_id = ${uid} and order_id= ${order_id}`, function(ee,rr) {
        
                  res.send({
                    code: 200,
                    data: {
                      success: true,
                      message: '提交订单成功',
                      data: rr // 返回当前订单的订单
                    }
                  })
        
                })
              })

            }
          })
        }

      })      
    })

  }
})


// 修改订单状态
router.post('/api/submitOrder', function(req, res, next) {

  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    // 订单号
    let orderId = req.body.orderId;
    // 选中商品的id
    let shopArr = req.body.shopArr;
    // 收货地址
    let address = req.body.address;

    // 获取当前用户的id
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      connection.query(`select * from store_order where user_id = ${uid} and order_id = ${orderId}`, function(e,r) {
        // 订单id
        let id = r[0].id;
        // 通过订单id修改订单状态  订单未结算 => 订单已结算
        connection.query(`update store_order set order_status = '2', goods_address = '${address}' where id = ${id}`, function(a,b) {
          // 删除购物车中的数据
          shopArr.forEach(v => {
            connection.query(`delete from goods_cart where id = ${v}`, function(aa,bb) {

            })
          })

          res.send({
            code: 200,
            data: {
              success: true,
              message: '操作成功'
            }
          });

        })

      })

    })

  }

})


// 获取已结算的订单
router.post('/api/payOrderList', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      connection.query(`select * from store_order where user_id = ${uid} and order_status = 2`, function(ee,rr) {

        // 存在已经结算的订单
        if(rr.length > 0) {
          let orderList = []

          rr.forEach((v, j) => {
            // 要传递的数据格式
            let obj = {
              id: v.id,
              order_id: v.order_id,
              order_time: v.order_id.slice(6),
              goods: [],
              address: v.goods_address.split(','),
              allPrice: v.goods_price,
              allNums: v.goods_num.split(',').reduce((p, item) => { return p + Number(item) }, 0)
            }

            let arr = v.goods_id.split(',');
            arr.forEach((a, i) => {
              connection.query(`select * from goods_list where id = ${a}`, function(e,r) {
                r[0].num = v.goods_num.split(',')[i]
                obj.goods[i] = r[0]
                if(i == arr.length - 1) {
                  orderList.push(obj)
                }
                if(i == arr.length - 1 && j == rr.length -1) {
                  res.send({
                    code: 200,
                    data: {
                      success: true,
                      message: '获取已结算的订单成功',
                      data: orderList
                    }
                  })

                }
              });
            });

          });

        } else {
          // 不存在已经结算的订单
          res.send({
            code: 200,
            data: {
              success: true,
              message: '没有已结算的订单',
              data: []
            }
          })
        }

        
      })
    })
  }
})

// 获取未结算的订单
router.post('/api/noPayOrderList', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      connection.query(`select * from store_order where user_id = ${uid} and order_status = 1`, function(ee,rr) {

        // 存在未结算的订单
        if(rr.length > 0) {
          let orderList = []

          rr.forEach((v, j) => {
            let obj = {
              id: v.id,
              order_id: v.order_id,
              order_time:  v.order_id.slice(6),
              goods: [],
              address: v.goods_address.split(','),
              allPrice: v.goods_price,
              allNums: v.goods_num.split(',').reduce((p, item) => { return p + Number(item) }, 0)
            }

            let arr = v.goods_id.split(',');
            arr.forEach((a, i) => {
              connection.query(`select * from goods_list where id = ${a}`, function(e,r) {
                r[0].num = v.goods_num.split(',')[i]
                obj.goods[i] = r[0]
                if(i == arr.length - 1) {
                  orderList.push(obj)
                }
                // 保证在最后一次循环时再传递数据
                if(i == arr.length - 1 && j == rr.length -1) {
                  res.send({
                    code: 200,
                    data: {
                      success: true,
                      message: '获取未结算的订单成功',
                      data: orderList
                    }
                  })

                }
              });
            });

          });

        } else {
          // 不存在未结算的订单
          res.send({
            code: 200,
            data: {
              success: true,
              message: '没有未结算的订单',
              data: []
            }
          })
        }

        
      })
    })
  }
})


// 删除未结算的订单
router.post('/api/deleteNoPayOrder', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    let orderId = req.body.id;

    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      connection.query(`delete from store_order where id = ${orderId} and user_id = ${uid}`, function(aa,bb) {
        res.send({
          code: 200,
          data: {
            success: true,
            message: '删除成功'
          }
        })
      })

    })
  }
})


// 收藏该商品
router.post('/api/addCollect', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    let goods_id = req.body.goodsId;

    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      connection.query(`select * from goods_list where id = ${goods_id}`, function(e,r) {

        let obj = r[0];
        let sqp = `insert into user_collect (goods_id,user_id,goods_imgUrl,goods_name,goods_price) values ("${goods_id}","${uid}","${obj.imgUrl}","${obj.name}","${obj.price}")`
        connection.query(sqp, function(a,b) {

          res.send({
            code: 200,
            data: {
              success: true,
              message: '收藏成功'
            }
          })

        })
      })
    })
  }
})


// 查询当前商品是否被该用户收藏
router.get('/api/isCollect', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    let id = req.query.goodsId;

    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id

      connection.query(`select * from user_collect where goods_id = ${id} and user_id = ${uid}`, function(e,r) {

        if(r.length > 0) {
          res.send({
            code: 200,
            data: {
              success: true
            }
          })
        } else {
          res.send({
            code: 404,
            data: {
              success: false
            }
          })
        }
      })

    })
  }
})


// 收藏该商品
router.post('/api/cancelCollect', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    let goods_id = req.body.goodsId;

    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      
      connection.query(`delete from user_collect where goods_id = ${goods_id} and user_id = ${uid}`, function(aa,bb) {
        res.send({
          code: 200,
          data: {
            success: true,
            message: '取消收藏成功'
          }
        })
      })

    })
  }
})

// 获取当前用户收藏的商品
router.post('/api/myCollect', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {

    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id

      connection.query(`select * from user_collect where user_id = ${uid}`, function(e,r) {

        res.send({
          code: 200,
          data: {
            success: true,
            message: '获取数据成功',
            data: r
          }
        });
      })

    })
  }
})


// 获取某个未结算的订单的详细信息
router.post('/api/getOneNoPayOrder', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    // 当前未结算的订单
    let id = req.body.id

    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      connection.query(`select * from store_order where user_id = ${uid} and id = ${id}`, function(ee,rr) {

          let v = rr[0];

          let obj = {
            id: v.id,
            order_id: v.order_id,
            order_time:  v.order_id.slice(6),
            goods: [],
            address: {
              name: v.goods_address.split(',')[0],
              tel: v.goods_address.split(',')[1],
              province: v.goods_address.split(',')[2],
              city: v.goods_address.split(',')[3],
              county: v.goods_address.split(',')[4],
              addressDetail: v.goods_address.split(',')[5]
            },
            allPrice: v.goods_price,
            allNums: v.goods_num.split(',').reduce((p, item) => { return p + Number(item) }, 0)
          }

          let arr = v.goods_id.split(',');
          arr.forEach((a, i) => {
            connection.query(`select * from goods_list where id = ${a}`, function(e,r) {
              r[0].num = v.goods_num.split(',')[i]
              obj.goods[i] = r[0]
              // 保证在最后一次循环时再传递数据
              if(i == arr.length - 1) {
                res.send({
                  code: 200,
                  data: {
                    success: true,
                    message: '获取未结算的订单成功',
                    data: obj
                  }
                })

              }
            });
          });
        
      })
    })
  }
})


// 结算未结算的订单
router.post('/api/payNoPayOrder', function(req, res, next) {
  // token
  let token = req.headers.token;
  // 后端解析token就知道是哪个用户了
  let tokenObj = jwt.decode(token)
  if(!tokenObj) {

    res.send({
      code: 404,
      data: {
        success: false,
        message: '请先登录'
      }
    })

  } else {
    let id = req.body.id
    let address = req.body.address
    let shopArr = req.body.shopArr

    connection.query(`select * from user where tel = ${tokenObj.tel}`, function(error,result) {
      // 用户id
      let uid = result[0].id
      connection.query(`update store_order set order_status = '2', goods_address = '${address}' where id = ${id} and user_id = ${uid}`, function(a,b) {
        shopArr.forEach(v => {
          connection.query(`delete from goods_cart where goods_id = ${v} and user_id = ${uid}`, function(aa,bb) {
          
          })
        })
        res.send({
          code: 200,
          data: {
            success: true,
            message: '结算成功'
          }
        })
      })
    })
  }
})



module.exports = router;
