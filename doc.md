# 软件设计的几个阶段

## 需求分析

明确任务定义是什么，限制条件是什么。例如：输入/输出数据的类型、值的范围以及形式等



## 概要设计

定义所需的数据结构；划分结构清晰、层次分明的主模块和各子功能模块；定义各模块之间的接口



## 详细设计

对模块流程进行描述，定义数据结构的基本操作，画出函数调用关系，写出函数的伪码算法



## 编码

选择一种合适的程序设计语言（软件开发环境），按设计说明产生程序



## 测试

设计测试用例，对软件进行测试



# 应完成的文档资料

## 设计任务的描述

城市之间有各种交通工具（汽车、火车和飞机）相连，有些城市之间无法直达，需要途径中转城市。某旅客于某一时刻向系统提出旅行要求。考虑在当前COVID-19疫情环境下，各个城市的风险程度不一样，分为低风险、中风险和高风险三种。系统根据风险评估，为该旅客设计一条符合旅行策略的旅行线路并输出；系统能查询当前时刻旅客所处的地点和状态（停留城市/所在交通工具），具体旅行策略见后。

## 功能需求说明及分析

1. 城市总数不少于10个，为不同城市设置不同的单位时间风险值：低风险城市为0.2；中风险城市为0.5；高风险城市为0.9。各种不同的风险城市分布要比较均匀，个数均不得小于3个。旅客在某城市停留风险计算公式为：旅客在某城市停留的风险=该城市单位时间风险值*停留时间。
2. 建立汽车、火车和飞机的时刻表（航班表），假设各种交通工具均为起点到终点的直达，中途无经停。
   - 不能太简单，城市之间不能总只是1班车次；
   - 整个系统中航班数不得超过10个，火车不得超过30列次；汽车班次无限制；
3. 旅客的要求包括：起点、终点和选择的低风险旅行策略。其中，低风险旅行策略包括：
     - 最少风险策略：无时间限制，风险最少即可
     - 限时最少风险策略：在规定的时间内风险最少
4. 旅行模拟系统以时间为轴向前推移，每10秒左右向前推进1个小时(非查询状态的请求不计时，即：有鼠标和键盘输入时系统不计时)；
5. 不考虑城市内换乘交通工具所需时间
6. 系统时间精确到小时
7. 建立日志文件，对旅客状态变化和键入等信息进行记录
8. 选做一：用图形绘制地图，并在地图上实时反映出旅客的旅行过程。
9. 选做二：为不同交通工具设置不同单位时间风险值，交通工具单位时间风险值分别为：汽车=2；火车=5；飞机=9。旅客乘坐某班次交通工具的风险= 该交通工具单位时间风险值\*该班次起点城市的单位风险值\*乘坐时间。将乘坐交通工具的风险考虑进来，实现前述最少风险策略和限时风险最少策略。

## 总体方案设计说明

### 软件开发环境

### 总体结构

### 模块划分

- 主模块

  接收键盘键入命令，分析该命令并调用相应的模块，并以时间为轴向前推进

- 旅行线路设计和输出模块

  生成相应的旅行线路

- 状态动态查询显示模块

- 日志文件处理模块

  完成相应的日志文件写入和查询结果输出等功能
  
- 图形化模块

## 数据结构说明和数据字典（数据名称、用途等）

- 城市风险表： 记录每个城市对应的风险值（单位时间）

  citiesRisk:

  | city     | risk |
  | -------- | ---- |
  | Haerbin  | 0.9  |
  | Beijing  | 0.5  |
  | Shanghai | 0.2  |
  | ...      | ...  |

- 交通工具风险表：记录每种交通工具对应的风险值（单位时间）

  vehiclesRisk:

  | vehicle  | risk |
  | -------- | ---- |
  | car      | 2    |
  | train    | 5    |
  | airplane | 9    |
  
- 汽车、火车和飞机的时刻表（航班表）：记录每种交通方式的编号、类型、起点、出发时间、终点、到达时间和风险（该交通工具单位时间风险值\*该班次起点城市的单位风险值\*乘坐时间）

  vehiclesTimetable:

  | number | type     | departure | departureTime | arrival  | arrivalTime | risk |
  | ------ | -------- | --------- | ------------- | -------- | ----------- | ---- |
  | 1      | car      | Beijing   | 08: 00        | Haerbin  | 16: 00      | 8    |
  | 2      | train    | Beijing   | 09: 00        | Shanghai | 18: 00      | 22.5 |
  | 3      | airplane | Shanghai  | 10: 00        | Beijing  | 13: 00      | 5.4  |
  | ...    | ...      | ...       | ...           | ...      | ...         | ...  |

- 旅客状态表：旅客代码、当前状态

  存储的旅客状态表：用所在交通工具和进度表示状态（其中用进度0%或者100%表示位于某城市）

  travelersStatus:

  | ID   | vehicle | status |
  | ---- | ------- | ------ |
  | 1    | 2       | 50%    |
  | 2    | 3       | 30%    |
  | 3    | 3       | 100%   |
  | ...  | ...     | ...    |

  展示的旅客状态表：

  | ID   | status       |
| ---- | ------------ |
  | 1    | on vehicle 2 |
  | 2    | on vehicle 3 |
  | 3    | In Beijing   |
  | ...  | ...          |
  
- 旅行计划表：旅客代码、旅行计划

  plan：按顺序记录着旅行乘坐的交通工具列表

  travelersPlans:

  | ID   | requestTime | departure | arrival  | plan     |
  | ---- | ----------- | --------- | -------- | -------- |
  | 1    | 08: 00      | Beijing   | Shanghai | [ 2 ]    |
  | 2    | 09: 00      | Shanghai  | Beijing  | [ 3 ]    |
  | 3    | 09: 00      | Shanghai  | Haerbin  | [ 3, 1 ] |
  | ...  |             |           |          |          |

- 日志文件：当前时间、事件

  log:

  | time | event |
  | ---- | ----- |
  |      |       |
  | ...  | ...   |

## 各模块设计说明
算法思想、算法、特点及与其它模块的关系等

- 主模块

  接收键盘键入命令，分析该命令并调用相应的模块，并以时间为轴向前推进

- 旅行线路设计和输出模块

  生成相应的旅行线路

- 状态动态查询显示模块

- 日志文件处理模块

  完成相应的日志文件写入和查询结果输出等功能

- 图形化模块

### 浏览器客户端（前端）

vue轮询更新数据

### 前后端接口（api）

| 描述             | 接口                    | 方法   | url参数                                                      | 备注                               |
| ---------------- | ----------------------- | ------ | ------------------------------------------------------------ | ---------------------------------- |
| 获取系统时间     | /api/current/time       | GET    |                                                              |                                    |
| 获取系统状态     | /api/current/status     | GET    |                                                              |                                    |
| 更新系统状态     | /api/current/status     | PUT    | operation                                                    | 0: 开始/继续；1: 暂停；2: 重新开始 |
| 获取旅客状态     | /api/travelers/status   | GET    |                                                              |                                    |
| 获取旅行计划     | /api/travelers/plans    | GET    |                                                              |                                    |
| 添加旅行计划     | /api/travelers/plans    | POST   | id, requestTime, departure, arrival                          |                                    |
| 更新旅行计划     | /api/travelers/plans    | PUT    | id, requestTime, departure, arrival                          |                                    |
| 删除旅行计划     | /api/travelers/plans    | DELETE | id                                                           |                                    |
| 获取交通工具时刻 | /api/vehicles/timetable | GET    |                                                              |                                    |
| 添加交通工具时刻 | /api/vehicles/timetable | POST   | number, type, departure, departureTime, arrival, arrivalTime |                                    |
| 更新交通工具时刻 | /api/vehicles/timetable | PUT    | number, type, departure, departureTime, arrival, arrivalTime |                                    |
| 删除交通工具时刻 | /api/vehicles/timetable | DELETE | number                                                       |                                    |
| 获取交通工具风险 | /api/vehicles/risk      | GET    |                                                              |                                    |
| 添加交通工具     | /api/vehicles/risk      | POST   | vehicle, risk                                                |                                    |
| 更新交通工具风险 | /api/vehicles/risk      | PUT    | vehicle, risk                                                |                                    |
| 删除交通工具     | /api/vehicles/risk      | DELETE | vehicle                                                      |                                    |
| 获取城市风险     | /api/cities/risk        | GET    |                                                              |                                    |
| 添加城市         | /api/cities/risk        | POST   | city, risk                                                   |                                    |
| 更新城市风险     | /api/cities/risk        | PUT    | city, risk                                                   |                                    |
| 删除城市         | /api/cities/risk        | DELETE | city                                                         |                                    |
| 获取日志         | /api/log                | GET    |                                                              |                                    |

### 服务器端（后端）

服务器端使用JavaScript语言，Node.js运行环境，Express框架

#### 文件目录架构

- app.js
- bin
  - www
- config
  - database.js
- controller
  - utils.js
- database
  - mysql.js
- model
  - resModel.js
- routes
  - api.js
  - index.js

#### 主要组成部分

##### /config/database.js

保存数据库设置信息，包括host、端口、用户名、密码和数据库名

##### /database/mysql.js

保存连接mysql数据库和执行sql语句的代码

##### /bin/www

保存启动服务端程序的代码，安装框架时自动生成

##### /app.js

保存服务端程序，调用路由组件来配置路由信息

##### /routes/api.js

保存/api路由的代码，负责配置各个子路由的信息

对于不同的http请求，调用对应的函数处理

##### /model/resModel.js

保存返回信息模型的代码，使得/routes/api.js响应的信息符合一定的格式

##### /controller/utils.js

保存对于不同的http请求相应的处理函数的代码

相应的处理函数使用对应的sql语句，调用/database/mysql.js的代码与数据库进行交互，对城市风险表、交通工具风险表、交通工具时刻表、旅客状态表、旅行计划表和日志文件进行增删查改

相应的处理函数处理系统的状态和时间

相应的处理函数每十秒调用函数，处理系统时间

## 范例执行结果及测试情况说明

## 评价和改进意见
## 用户使用说明

# 面向用户的文档

指明如何使用、维护、修改程序。如用户手册、操作手册等。

# 面向开发者的文档

保证软件按质、按期有效地进行开发。