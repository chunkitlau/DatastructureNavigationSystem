<template>
  <div id="app">
    <el-container>
      <el-main>
        <div id="map" class="map" style="width: 100%; height: 660px; border: 2px solid black; "></div>
        <div id="geo-marker"></div>
        <div style="display: none;">
          <!-- Popup -->
          <div id="popup" title=""></div>
        </div>
      </el-main>
      <el-aside width="35%">
        <el-container>
          <el-header height="10%">
            <span>校园导览系统</span>
          </el-header>
          <el-main height="80%">
            <el-row :gutter="20">
              <el-col :span="8"><span>北京时间: {{backendTime.hour}}时  {{backendTime.minute}}分  {{backendTime.second}}秒</span></el-col>
              <el-col :span="16"> 
                <el-time-picker v-model="initialTime" :picker-options="{selectableRange: '6:30:00 - 22:30:00'}" placeholder="任意时间点"></el-time-picker>
                <el-tooltip content="重置系统时间" placement="top" effect="dark">
                  <el-button @click="handleRestartTime" type="primary" icon="el-icon-edit" circle></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row :gutter="20">
            <el-col :span="12" :offset="0"><span>路线时间: {{ Math.floor(currentTime / 3600) }} hour {{ Math.floor(currentTime / 60) }} minute {{ Math.floor(currentTime) % 60 }} second</span><br></el-col>
            <el-col :span="12" :offset="0"><span>经过位置: {{ currentPositionName }} </span></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-switch style="display: block" v-model="buptCampusValue" active-color="#13ce66" inactive-color="#409EFF" active-text="沙河校区" inactive-text="西土城校区"></el-switch>
              </el-col>
              <el-col :span="12">
                <el-switch style="display: block" v-model="detailValue" active-color="#13ce66" inactive-color="#409EFF" active-text="显示细节" inactive-text="隐藏细节"></el-switch>
              </el-col>
              
            </el-row>
            
            <el-button-group>
              <el-button @click="handlePlay" type="success" icon="el-icon-video-play">play</el-button>
              <el-button @click="handlePause" type="warning" icon="el-icon-video-pause">pause</el-button>
              <el-button @click="handleReset" type="danger" icon="el-icon-refresh-left">reset</el-button>
              <el-button @click="setNavigateFormVisible = true" type="primary" icon="el-icon-s-promotion">navigate</el-button>
              <el-button @click="addFacilityFormVisible = true" type="primary" icon="el-icon-circle-plus-outline">add facility</el-button>
              <el-button @click="addRoadFormVisible = true" type="primary" icon="el-icon-circle-plus-outline">add road</el-button>
              <el-dialog title="navigate" :visible.sync="setNavigateFormVisible">
                <el-form :model="navigateForm">
                  <el-form-item label="departure" :label-width="formLabelWidth">
                    <el-select v-model="navigateForm.departure" filterable remote reserve-keyword :remote-method="searchFacilitysNormal" placeholder="please select departure">
                      <el-option v-for="facility in facilitysNormalOptions" :key="facility.id" :label="facility.name + ': ' + facility.description" :value="facility.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="arrival" :label-width="formLabelWidth">
                    <el-select v-model="navigateForm.arrival" filterable remote reserve-keyword :remote-method="searchFacilitys" placeholder="please select arrival">
                      <el-option v-for="facility in facilitysOptions" :key="facility.key" :label="facility.name + ': ' + facility.description" :value="facility.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="strategy" :label-width="formLabelWidth">
                    <el-select v-model="navigateForm.strategy.strategy" placeholder="Please select strategy">
                      <el-option v-for="item in strategyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <div v-if="navigateForm.strategy.strategy == '2'">
                    <el-form-item
                      :label-width="formLabelWidth"
                      v-for="(pathpoint, index) in navigateForm.strategy.pathpoints"
                      :label="'pathpoint ' + index"
                      :key="pathpoint.key"
                      :prop="'pathpoints.' + index + '.value'"
                      :rules="{required: true, message: 'pathpoint can\'t be empty', trigger: 'blur'}">
                    <el-select v-model="pathpoint.value" filterable remote reserve-keyword :remote-method="searchFacilitysNormal" placeholder="please select pathpoint">
                      <el-option v-for="facility in facilitysNormalOptions" :key="facility.id" :label="facility.name + ': ' + facility.description" :value="facility.id"></el-option>
                    </el-select>
                    <el-button @click.prevent="removePathpoint(pathpoint)">delete</el-button>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth">
                    <el-button @click="addPathpoint">new pathpoint</el-button>
                  </el-form-item>
                  </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="setNavigateFormVisible = false">cancel</el-button>
                  <el-button type="primary" @click="setNavigateFormVisible = false, setNavigate()">confirm</el-button>
                </div>
              </el-dialog>
              <el-dialog title="adding facility" :visible.sync="addFacilityFormVisible">
                <span>using the position last click to add facility</span>
                <el-form :model="form">
                  <el-form-item label="name" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="type" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.type" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="description" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.description" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addFacilityFormVisible = false">cancel</el-button>
                  <el-button type="primary" @click="addFacilityFormVisible = false, addFacility()">confirm</el-button>
                </div>
              </el-dialog>
              <el-dialog title="adding road" :visible.sync="addRoadFormVisible">
                <span>using the position last click to add road</span>
                <el-form :model="form">
                  <el-form-item label="type" :label-width="formLabelWidth">
                    <el-input v-model="roadForm.type" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="fromid" :label-width="formLabelWidth">
                    <el-input v-model="roadForm.fromid" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="toid" :label-width="formLabelWidth">
                    <el-input v-model="roadForm.toid" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="efficiency" :label-width="formLabelWidth">
                    <el-input v-model="roadForm.efficiency" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addRoadFormVisible = false">cancel</el-button>
                  <el-button type="primary" @click="addRoadFormVisible = false, addRoad()">confirm</el-button>
                </div>
              </el-dialog>
            </el-button-group>
            <el-tabs type="border-card">
              <el-tab-pane label="附近">
                <el-table :data="nearby" height="500" stripe style="width: 100%">
                  <el-table-column prop="dist" label="距离(m)" width="80"></el-table-column>
                  <el-table-column prop="name" label="名称" width="120"></el-table-column>
                  <el-table-column prop="type" label="类型" width="100"></el-table-column>
                  <el-table-column prop="description" label="标签" width="90"></el-table-column>
                  <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="navigateForm.departure = scope.row.id">设为起点</el-button><br/>
                      <el-button size="mini" @click="navigateForm.arrival = scope.row.id, setNavigate()">设为终点</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="导航路线">
                <el-table :data="routeData" height="500" stripe style="width: 100%">
                  <el-table-column prop="fromname" label="出发点" width="120"></el-table-column>
                  <el-table-column prop="toname" label="到达点" width="120"></el-table-column>
                  <el-table-column prop="type" label="边类型" width="60"></el-table-column>
                  <el-table-column prop="efficiency" label="拥挤度" width="120"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="全部建筑">
                <el-table :data="facilityswithouttype0" height="500" stripe style="width: 100%">
                  <el-table-column prop="name" label="名称" width="120"></el-table-column>
                  <el-table-column prop="type" label="类型" width="100"></el-table-column>
                  <el-table-column prop="description" label="标签" width="120"></el-table-column>
                  <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="navigateForm.departure = scope.row.id">设为起点</el-button><br/>
                      <el-button size="mini" @click="navigateForm.arrival = scope.row.id, setNavigate()">设为终点</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="全部路径">
                <el-table :data="paths" height="500" stripe style="width: 100%">
                  <el-table-column prop="type" label="边类型" width="60"></el-table-column>
                  <el-table-column prop="fromname" label="出发点" width="120"></el-table-column>
                  <el-table-column prop="toname" label="到达点" width="120"></el-table-column>
                  <el-table-column prop="efficiency" label="拥挤度" width="90"></el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="editPaths(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini" type="danger" @click="deletePaths(scope.$index, scope.row)">delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="班车时刻表">
                <el-table :data="schoolBusTimetable" height="500" stripe style="width: 100%">
                  <el-table-column prop="direction" label="方向" width="120"></el-table-column>
                  <el-table-column prop="departureTime" label="出发时间" width="120"></el-table-column>
                  <el-table-column prop="arrivalTime" label="预计抵达时间" width="120"></el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="editVehiclesTimetable(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini" type="danger" @click="deleteVehiclesTimetable(scope.$index, scope.row)">delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="食堂">
                <el-table :data="canteenTable" height="500" stripe style="width: 100%">
                  <el-table-column prop="name" label="名称" width="120"></el-table-column>
                  <el-table-column prop="type" label="类型" width="100"></el-table-column>
                  <el-table-column prop="description" label="标签" width="90"></el-table-column>
                  <el-table-column prop="count" label="人流量" width="70"></el-table-column>
                  <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="navigateForm.departure = scope.row.id">设为起点</el-button><br/>
                      <el-button size="mini" @click="navigateForm.arrival = scope.row.id, setNavigate()">设为终点</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
            <!--
            <router-view />
            -->
          </el-main>
          <el-footer height="10%">
            Copyright © 2021 - present Chunkit Lau, Jijun Chi, Hanyan Yin; all rights reserved
          </el-footer>
        </el-container>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import Map from 'ol/Map';
import {createStringXY} from 'ol/coordinate';
import { fromLonLat, toLonLat, transform } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import Text from 'ol/style/Text';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polyline from 'ol/format/Polyline';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';

// 声明地图
var map;

// 坐标格式转换
function trans(location){
  return transform(Object.values(location),'EPSG:4326','EPSG:3857');
}

// 采点
var lastclick = [[0,0],[0,0]], lastclickp = 1;
var markerEl,marker;
var positionSearch;

// 点表和边表
var dotTable,edgeTable;

// 本部视角
var buptMainCampus = new ol.View({
  center: [12952250, 4860150],
  zoom: 16.61
});
// 沙河视角
var buptShaheCampus = new ol.View({
  center: [12944600, 4888600],
  zoom: 16.6
});
// 本部与沙河视角
var buptCampus = new ol.View({
  center: [12948425, 4875300],
  zoom: 11.7
});

// 地图当前视角
var buptCampusValue = 0;
var detailValue = 1;
var buptCampusView = [buptMainCampus, buptShaheCampus, buptCampus];

var mapView = buptCampusView[buptCampusValue];

// ol样式
var styles = {
  'route': new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 6,
      color: [237, 212, 0, 0.8]
    }),
  }),
  'route1': new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 6,
      color: [0, 212, 0, 0.8]
    }),
  }),
  'icon': [new ol.style.Style({
    image: new ol.style.Icon({
      scale: .7, opacity: 1,
      rotateWithView: false,
      anchorXUnits: 'fraction', anchorYUnits: 'fraction',
      anchor: [0.5, 1],
      src: '//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png',
    }),
    zIndex: 5
  }),new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({ color: 'rgba(255,255,255,1)' }),
    }),
    zIndex: 4
  })],

  'geoMarker': new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({color: 'black'}),
      stroke: new ol.style.Stroke({
        color: 'white',
        width: 2,
      }),
    }),
  }),
};

// 目前的一些features基本上都是往sourceFeatures里面加的
var sourceFeatures = new ol.source.Vector();
var layerFeatures = new ol.layer.Vector({ source: sourceFeatures });

// routeData存放导航路径信息
var route;

// 导航的一些features
var routeFeature=new ol.Feature();
var startMarker = new ol.Feature(), stopMarker=new ol.Feature();
var lineStringFeature = new ol.Feature();
var lineString=new ol.geom.LineString([]);

// 导航layer
var routeLayer=new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [routeFeature,startMarker,stopMarker,lineStringFeature]
  })
});

var isPlay = false, isInitAnimation = false;
var deltaTtime = 25.0;
var polyline = null;
var pathWeight = [], pathWeightSum =[];

var internalMarker = '';

// 室内导航
var indoorData={"elements":[{"type":"way","id":947311109,"nodes":[[116.285706,40.1573861],[116.2857556,40.1572744],[116.2859809,40.1573297],[116.2859233,40.1574404],[116.285706,40.1573861]],"tags":{"indoor":"room","level":"0","name":"N-105, N-107","room":"class"}},{"type":"way","id":947311111,"nodes":[[116.2855384,40.157177],[116.2855855,40.1570668],[116.2858294,40.1571278],[116.2857798,40.1572375],[116.2855384,40.157177]],"tags":{"indoor":"room","level":"0","name":"N-102, N-104","room":"class"}},{"type":"way","id":947311130,"nodes":[[116.2867521,40.1576464],[116.2868017,40.157545],[116.2870029,40.1575942],[116.2870042,40.1575911],[116.2870029,40.1575942],[116.286959,40.1576974],[116.2867521,40.1576464]],"tags":{"indoor":"room","level":"0","name":"N-119, N-120","room":"class"}},{"type":"way","id":947374856,"nodes":[[116.2859273,40.1574404],[116.2859809,40.1573297],[116.2861902,40.157381],[116.2861365,40.1574937],[116.2859273,40.1574404]],"tags":{"indoor":"room","level":"0","name":"N-109, N-111","room":"class"}},{"type":"way","id":947376695,"nodes":[[116.2860514,40.1571824],[116.2860024,40.1572874],[116.2862143,40.1573408],[116.2862599,40.1572344],[116.2860514,40.1571824]],"tags":{"indoor":"room","level":"0","name":"N-106, N-108","room":"class"}},{"type":"way","id":947376697,"nodes":[[116.2863725,40.1573041],[116.2865477,40.1573513],[116.2865174,40.1574229],[116.2863404,40.1573769],[116.2863725,40.1573041]],"tags":{"indoor":"room","level":"0","name":"N-110, N-112","room":"class"}},{"type":"way","id":947376698,"nodes":[[116.2865477,40.1573513],[116.2865174,40.1574229],[116.2866823,40.1574671],[116.286714,40.1573943],[116.2865477,40.1573513]],"tags":{"indoor":"room","level":"0","name":"N-114, N-116","room":"class"}},{"type":"way","id":947376701,"nodes":[[116.2862679,40.1575255],[116.2863162,40.157423],[116.2865616,40.1574834],[116.2865155,40.1575874],[116.2862679,40.1575255]],"tags":{"indoor":"room","level":"0","name":"N-113, N-115","room":"class"}},{"type":"way","id":947376702,"nodes":[[116.2865155,40.1575874],[116.2865616,40.1574834],[116.2868017,40.157545],[116.2867521,40.1576464],[116.2865155,40.1575874]],"tags":{"indoor":"room","level":"0","name":"N-117, N-118","room":"class"}},{"type":"way","id":947382317,"nodes":[[116.2856832,40.1568459],[116.2859233,40.1569044],[116.2859675,40.1568019],[116.2857279,40.1567417],[116.2856832,40.1568459]],"tags":{"indoor":"room","level":"0","name":"S-101, S-103","room":"class"}},{"type":"way","id":947382411,"nodes":[[116.2857878,40.156602],[116.2857463,40.1566993],[116.2859823,40.1567568],[116.2860272,40.1566614],[116.2857878,40.156602]],"tags":{"indoor":"room","level":"0","name":"S-102, S-104","room":"class"}},{"type":"way","id":947382412,"nodes":[[116.2859823,40.1567568],[116.2862022,40.1568117],[116.286247,40.1567159],[116.2860292,40.1566619],[116.2859823,40.1567568]],"tags":{"indoor":"room","level":"0","name":"S-106, S-108","room":"class"}},{"type":"way","id":947382413,"nodes":[[116.2861461,40.1569596],[116.2863497,40.1570118],[116.2863967,40.1569102],[116.2861888,40.1568599],[116.2861461,40.1569596]],"tags":{"indoor":"room","level":"0","name":"S-105, S-107","room":"class"}},{"type":"way","id":947382425,"nodes":[[116.2862022,40.1568117],[116.286247,40.1567159],[116.2864592,40.1567685],[116.2864141,40.1568654],[116.2862022,40.1568117]],"tags":{"indoor":"room","level":"0","name":"S-110, S-112","room":"class"}},{"type":"way","id":947382426,"nodes":[[116.2864986,40.1570148],[116.2866662,40.1570591],[116.2866998,40.1569863],[116.2865335,40.1569423],[116.2864986,40.1570148]],"tags":{"indoor":"room","level":"0","name":"S-109, S-111","room":"class"}},{"type":"way","id":947383775,"nodes":[[116.2866662,40.1570591],[116.2868486,40.1571042],[116.2868795,40.1570323],[116.2866998,40.1569863],[116.2866662,40.1570591]],"tags":{"indoor":"room","level":"0","name":"S-113, S-115","room":"class"}},{"type":"way","id":947383871,"nodes":[[116.2865442,40.1568958],[116.2868004,40.1569628],[116.2868441,40.156864],[116.2865885,40.1568008],[116.2865442,40.1568958]],"tags":{"indoor":"room","level":"0","name":"S-114, S-116","room":"class"}},{"type":"way","id":947383872,"nodes":[[116.2868004,40.1569628],[116.287031,40.1570222],[116.2870785,40.1569222],[116.2868474,40.1568648],[116.2868004,40.1569628]],"tags":{"indoor":"room","level":"0","name":"S-117, S-118","room":"class"}},{"type":"way","id":947383873,"nodes":[[116.287031,40.1570222],[116.2872241,40.1570725],[116.2872682,40.1569692],[116.2870818,40.156923],[116.287031,40.1570222]],"tags":{"indoor":"room","level":"0","name":"S-119, S-120","room":"class"}},{"type":"way","id":947557841,"nodes":[[116.2836099,40.1556344],[116.2835907,40.1556777],[116.283579,40.1557041],[116.2835361,40.1556938],[116.2835696,40.1556211],[116.2836099,40.1556344]],"tags":{"indoor":"room","level":"0","name":"S4-112","room":"bedroom"}},{"type":"way","id":947557842,"nodes":[[116.2832022,40.1556293],[116.28317,40.155702],[116.2831271,40.1556918],[116.2831606,40.155619],[116.2832022,40.1556293]],"tags":{"indoor":"room","level":"0","name":"S4-128","room":"bedroom"}},{"type":"way","id":947557844,"nodes":[[116.283571,40.1556211],[116.2835388,40.1556938],[116.2834959,40.1556836],[116.2835294,40.1556108],[116.283571,40.1556211]],"tags":{"indoor":"room","level":"0","name":"S4-113","room":"bedroom"}},{"type":"way","id":947557845,"nodes":[[116.2835294,40.1556108],[116.2834972,40.1556836],[116.2834543,40.1556733],[116.2834878,40.1556006],[116.2835294,40.1556108]],"tags":{"indoor":"room","level":"0","name":"S4-114","room":"bedroom"}},{"type":"way","id":947557846,"nodes":[[116.2834905,40.1555975],[116.2834583,40.1556703],[116.2834154,40.15566],[116.2834489,40.1555872],[116.2834905,40.1555975]],"tags":{"indoor":"room","level":"0","name":"S4-115","room":"bedroom"}},{"type":"way","id":947557847,"nodes":[[116.283451,40.1555872],[116.2834188,40.15566],[116.2833758,40.1556498],[116.2834094,40.155577],[116.283451,40.1555872]],"tags":{"indoor":"room","level":"0","name":"S4-117","room":"bedroom"}},{"type":"way","id":947557848,"nodes":[[116.2834107,40.155577],[116.2833785,40.1556498],[116.2833356,40.1556395],[116.2833691,40.1555667],[116.2834107,40.155577]],"tags":{"indoor":"room","level":"0","name":"S4-119","room":"bedroom"}},{"type":"way","id":947557849,"nodes":[[116.2833698,40.1555657],[116.2833376,40.1556385],[116.2832947,40.1556282],[116.2833282,40.1555555],[116.2833698,40.1555657]],"tags":{"indoor":"room","level":"0","name":"S4-121","room":"bedroom"}},{"type":"way","id":947557853,"nodes":[[116.2833289,40.1555534],[116.2832967,40.1556262],[116.2832538,40.1556159],[116.2832873,40.1555432],[116.2833289,40.1555534]],"tags":{"indoor":"room","level":"0","name":"S4-123","room":"bedroom"}},{"type":"way","id":947557854,"nodes":[[116.283288,40.1555427],[116.2832558,40.1556154],[116.2832129,40.1556052],[116.2832464,40.1555324],[116.283288,40.1555427]],"tags":{"indoor":"room","level":"0","name":"S4-125","room":"bedroom"}},{"type":"way","id":947557855,"nodes":[[116.2832464,40.1555324],[116.2832142,40.1556052],[116.2831727,40.1555954],[116.2831713,40.1555949],[116.2832049,40.1555222],[116.2832464,40.1555324]],"tags":{"indoor":"room","level":"0","name":"S4-127","room":"bedroom"}},{"type":"way","id":947557856,"nodes":[[116.2832049,40.1555227],[116.2831727,40.1555954],[116.2831713,40.1555949],[116.2831298,40.1555852],[116.2831633,40.1555124],[116.2832049,40.1555227]],"tags":{"indoor":"room","level":"0","name":"S4-129","room":"bedroom"}},{"type":"way","id":947557857,"nodes":[[116.2831633,40.1555124],[116.2831311,40.1555852],[116.2830882,40.1555749],[116.2831217,40.1555022],[116.2831633,40.1555124]],"tags":{"indoor":"room","level":"0","name":"S4-130","room":"bedroom"}},{"type":"way","id":947557858,"nodes":[[116.2832438,40.1556405],[116.2832116,40.1557133],[116.2831686,40.1557031],[116.2832022,40.1556303],[116.2832438,40.1556405]],"tags":{"indoor":"room","level":"0","name":"S4-126","room":"bedroom"}},{"type":"way","id":947557861,"nodes":[[116.283284,40.1556518],[116.2832518,40.1557246],[116.2832089,40.1557143],[116.2832424,40.1556416],[116.283284,40.1556518]],"tags":{"indoor":"room","level":"0","name":"S4-124","room":"bedroom"}},{"type":"way","id":947557862,"nodes":[[116.2833256,40.1556631],[116.2832934,40.1557359],[116.2832505,40.1557256],[116.283284,40.1556528],[116.2833256,40.1556631]],"tags":{"indoor":"room","level":"0","name":"S4-122","room":"bedroom"}},{"type":"way","id":947557863,"nodes":[[116.2833671,40.1556723],[116.2833349,40.1557451],[116.283292,40.1557348],[116.2833256,40.1556621],[116.2833671,40.1556723]],"tags":{"indoor":"room","level":"0","name":"S4-120","room":"bedroom"}},{"type":"way","id":947557865,"nodes":[[116.2834087,40.1556826],[116.2833765,40.1557553],[116.2833336,40.1557451],[116.2833671,40.1556723],[116.2834087,40.1556826]],"tags":{"indoor":"room","level":"0","name":"S4-118","room":"bedroom"}},{"type":"way","id":947557866,"nodes":[[116.2834503,40.1556949],[116.2834181,40.1557676],[116.2833752,40.1557574],[116.2834087,40.1556846],[116.2834503,40.1556949]],"tags":{"indoor":"room","level":"0","name":"S4-116","room":"bedroom"}},{"type":"way","id":947568054,"nodes":[[116.2835938,40.1558507],[116.2835804,40.155886],[116.2834798,40.1558635],[116.2834952,40.1558286],[116.2835938,40.1558507]],"tags":{"indoor":"room","level":"0","name":"S4-105","room":"bedroom"}},{"type":"way","id":947569630,"nodes":[[116.283579,40.1558865],[116.2835656,40.1559219],[116.283465,40.1558994],[116.2834805,40.1558645],[116.283579,40.1558865]],"tags":{"indoor":"room","level":"0","name":"S4-104","room":"bedroom"}},{"type":"way","id":947569633,"nodes":[[116.2835623,40.1559229],[116.2835489,40.1559583],[116.2834483,40.1559357],[116.2834637,40.1559009],[116.2835623,40.1559229]],"tags":{"indoor":"room","level":"0","name":"S4-103","room":"bedroom"}},{"type":"way","id":947569634,"nodes":[[116.2835468,40.1559583],[116.2835334,40.1559937],[116.2834335,40.1559711],[116.2834483,40.1559363],[116.2835468,40.1559583]],"tags":{"indoor":"room","level":"0","name":"S4-102","room":"bedroom"}},{"type":"way","id":947569635,"nodes":[[116.2835314,40.1559937],[116.283518,40.156029],[116.2834174,40.1560065],[116.2834328,40.1559716],[116.2835314,40.1559937]],"tags":{"indoor":"room","level":"0","name":"S4-101","room":"bedroom"}},{"type":"way","id":947569636,"nodes":[[116.2837158,40.1555995],[116.2836991,40.1556344],[116.2836085,40.1556098],[116.283624,40.1555749],[116.2837158,40.1555995]],"tags":{"indoor":"room","level":"0","name":"S4-106","room":"bedroom"}},{"type":"way","id":947570845,"nodes":[[116.2837326,40.1555647],[116.2837158,40.1555995],[116.2836253,40.1555749],[116.2836407,40.1555401],[116.2836414,40.1555401],[116.2837319,40.1555647],[116.2837326,40.1555647]],"tags":{"indoor":"room","level":"0","name":"S4-107","room":"bedroom"}},{"type":"way","id":947570846,"nodes":[[116.2837487,40.1555298],[116.2837319,40.1555647],[116.2836414,40.1555401],[116.2836568,40.1555052],[116.2837487,40.1555298]],"tags":{"indoor":"room","level":"0","name":"S4-108","room":"bedroom"}},{"type":"way","id":947570849,"nodes":[[116.2837654,40.1554945],[116.2837487,40.1555293],[116.2836582,40.1555047],[116.2836736,40.1554699],[116.2836749,40.1554704],[116.2837654,40.1554945]],"tags":{"indoor":"room","level":"0","name":"S4-109","room":"bedroom"}},{"type":"way","id":947570850,"nodes":[[116.2837822,40.1554601],[116.2837654,40.155495],[116.2836749,40.1554704],[116.2836903,40.1554355],[116.2837822,40.1554601]],"tags":{"indoor":"room","level":"0","name":"S4-110","room":"bedroom"}},{"type":"way","id":947570851,"nodes":[[116.2837983,40.1554258],[116.2837815,40.1554607],[116.283691,40.1554361],[116.2837064,40.1554012],[116.2837983,40.1554258]],"tags":{"indoor":"room","level":"0","name":"S4-111","room":"bedroom"}},{"type":"way","id":947737862,"nodes":[[116.2857556,40.1572744],[116.2855203,40.1572204],[116.2854741,40.1573291],[116.285706,40.1573861],[116.2857556,40.1572744]],"tags":{"indoor":"room","level":"0","name":"N-101, N-103","room":"class"}}]};

export default {
  name: 'App',
  data() {
    return {
      map: null,
      currentTime: 0,
      initialTime: new Date(2021, 5, 20, 8, 0),
      backendTime: { hour: 8, minute: 0, second: 0 },
      timeCount: 0,
      posisiontNow: 0,
      buptCampusValue: 0,
      detailValue: 0,
      facilitysOptions: [],
      facilitysNormalOptions: [],
      setNavigateFormVisible: false,
      addDialogFormVisible: false,
      addTravelersPlansVisible: false,
      addVehiclesTimetableVisible: false,
      addFacilityFormVisible: false,
      addRoadFormVisible: false,
      formLabelWidth: '120px',
      navigateForm: { departure: '', arrival: '', 
        strategy: {
          strategy: '0',
          pathpoints: [{
              value: ''
          }]
        }
      },
      facilityForm: { name: '', type: '', description: '', position: '' },
      roadForm: { type: '', departure: '', arrival: '', efficiency: '' },
      travelersPlansForm: { id: '', requestTime: '', departure: '', arrival: '', plan: '' },
      schoolBusTimetableForm: { direction: '', departureTime: '', arrival: '', arrivalTime: '', },
      form: {},
      facilitys: [],
      facilityswithouttype0: [],
      paths: [],
      nearby: [],
      routeData: [{fromid: 0}],
      schoolBusTimetable: [],
      canteenTable: [],
      travelersStatus: [],
      travelersPlans: [],
      log: [],
      strategyOptions: [{
          value: '0',
          label: '最短距离策略'
        }, {
          value: '1',
          label: '最短时间策略'
        }, {
          value: '2',
          label: '途径最短距离策略'
        }, {
          value: '3',
          label: '交通工具的最短时间策略'
        }],
    }
  },
  computed: {
    currentPosition: function () {
      try {
        return this.facilitys.find(element => element.id == this.routeData[this.posisiontNow].fromid);
      }
      catch (err){
        return null;
      }
    },
    currentPositionID: function () {
      try {
        return this.currentPosition.id;
      }
      catch (err){
        return null;
      }
    },
    currentPositionName: function () {
      try {
        return this.currentPosition.name;
      }
      catch (err){
        return null;
      }
    },
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    buptCampusValue: function (newBuptCampusValue, oldBuptCampusValue) {
      buptCampusValue = Number(newBuptCampusValue);
      map.setView(buptCampusView[buptCampusValue]);
    },
    detailValue: function (newDetailValue, oldDetailValue) {
      detailValue = Number(newDetailValue);
      this.displayData();
    }
  },
  methods: {
    searchFacilitys(query) {
      if (query !== '') {
        if (isPlay) {
          positionSearch = internalMarker;
        }
        if (positionSearch == '') {
          positionSearch = transform(buptCampusView[buptCampusValue].q.center, 'EPSG:3857' ,'EPSG:4326')
        }
        console.log(positionSearch)
        this.$axios.get(`/api/facilitys?description=${query}&position=${positionSearch}`)// !
        .then(res => {
          this.facilitysOptions = res.data.data
          console.log(this.facilitysOptions)
        })
        .catch(err => {
          console.log('error', err)
        })
      }
      else {
        this.facilitysOptions = this.facilitys;
      }
    },
    searchFacilitysNormal(query) {
      this.$axios.get(`/api/facilitys?description=${query}`)// !
      .then(res => {
        this.facilitysNormalOptions = res.data.data
        console.log(this.facilitysNormalOptions)
      })
      .catch(err => {
        console.log('error', err)
      })
    },
    removePathpoint(item) {
      var index = this.navigateForm.strategy.pathpoints.indexOf(item)
      if (index !== -1) {
        this.navigateForm.strategy.pathpoints.splice(index, 1)
      }
    },
    addPathpoint() {
      this.navigateForm.strategy.pathpoints.push({
        value: '',
        key: Date.now()
      });
    },
    setNavigate() {
      console.log(this.navigateForm);
      this.currentTime=0.;
      if (this.posisiontNow) {
        this.posisiontNow = 0;
      }
      else {
        this.posisiontNow = 1;
        this.posisiontNow = 0;
      }
      this.initAnimation();
      isInitAnimation = true;
      isPlay = false;
    },
    getFacilitys() {
      this.$axios.get('/api/facilitys/all')// !
        .then(res => {
          this.facilitys = res.data.data
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getFacilitysWithoutType0() {
      this.$axios.get('/api/facilitys')// !
        .then(res => {
          this.facilityswithouttype0 = res.data.data
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    addFacility() {
      this.facilityForm.position = lastclick[lastclickp]
      this.$axios.post(`/api/facility?name=${this.facilityForm.name}&type=${this.facilityForm.type}&position=${this.facilityForm.position}&description=${this.facilityForm.description}`)// !
        .then(res => {
          this.citiesRiskForm = {}
          this.getFacilitys();
          this.displayData();
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    editFacilitys(index, row) {
      this.$axios.put(`/api/facilitys?facility=${row.city}`)// !
        .then(res => {
          this.getFacilitys()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    deleteFacilitys(index, row) {
      this.$axios.delete(`/api/facilitys?city=${row.city}`)// !
        .then(res => {
          this.getFacilitys()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getPaths() {
      this.$axios.get('/api/roads')// !
        .then(res => {
          this.paths = res.data.data
          for (let index=0,len=this.paths.length; index<len; ++index) {
            this.paths[index].fromname = this.facilitys.find(item=>item.id===this.paths[index].fromid).name
            this.paths[index].toname = this.facilitys.find(item=>item.id===this.paths[index].toid).name
          }
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    addRoad() {
      this.$axios.post(`/api/road?type=${this.roadForm.type}&fromid=${this.roadForm.fromid}&toid=${this.roadForm.toid}&efficiency=${this.roadForm.efficiency}`)// !
        .then(res => {
          this.citiesRiskForm = {}
          this.getPaths();
          this.displayData();
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    editPaths(index, row) {
      this.$axios.put(`/api/roads?number=${row.number}`)// !
        .then(res => {
          this.getPaths()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    deletePaths(index, row) {
      this.$axios.delete(`/api/roads?number=${row.number}`)// !
        .then(res => {
          this.getPaths()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getSchoolBusTimetable() {
      this.$axios.get('/api/timetable/schoolbus')// !
        .then(res => {
          this.schoolBusTimetable = res.data.data
          for(let i = 0; i < this.schoolBusTimetable.length; i++) {
            this.schoolBusTimetable[i] = {
              direction: this.schoolBusTimetable[i].direction == "-1" ? "本部 -> 沙河" : "沙河 -> 本部",
              departureTime: this.schoolBusTimetable[i].hour.toString() + "时 " + this.schoolBusTimetable[i].minute.toString() + "分",
              arrivalTime: ((this.schoolBusTimetable[i].hour + 1) % 24).toString() + "时 " + this.schoolBusTimetable[i].minute.toString() + "分"
            }
          }
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getCanteenTable(){
      this.$axios.get('/api/table/cateen')
        .then(res => {
          this.canteenTable = res.data.data
        })
    },
    addVehiclesTimetable() {
      this.$axios.post(`/api/vehicles/timetable?number=${this.vehiclesTimetableForm.number}&type=${this.vehiclesTimetableForm.type}&departure=${this.vehiclesTimetableForm.departure}&departuretime=${this.vehiclesTimetableForm.departureTime}&arrival=${this.vehiclesTimetableForm.arrival}&arrivaltime=${this.vehiclesTimetableForm.arrivalTime}&risk=${this.vehiclesTimetableForm.risk}`)// !
        .then(res => {
          this.vehiclesTimetableForm = {}
          this.getVehiclesTimetable()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    editVehiclesTimetable(index, row) {
      this.$axios.put(`/api/vehicles/timetable?number=${row.number}`)// !
        .then(res => {
          this.getVehiclesTimetable()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    deleteVehiclesTimetable(index, row) {
      this.$axios.delete(`/api/vehicles/timetable?number=${row.number}`)// !
        .then(res => {
          this.getVehiclesTimetable()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getAllData() {
      this.getSchoolBusTimetable()
      this.getCanteenTable()
      this.getFacilitys()
      this.getFacilitysWithoutType0()
      this.getPaths()
    },
    displayData() {
      if(!detailValue) { // hide layers
        console.log("triggered!");
        sourceFeatures.clear();
        // map.removeLayer(layerEdge);
        return;
      }
      
      for(var i in dotTable){
        var feature=new ol.Feature({
          geometry: new ol.geom.Point(transform(Object.values(dotTable[i].location),'EPSG:4326','EPSG:3857')),
          name: dotTable[i].id
        });
        feature.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: 'rgba(255,255,255,1)' }),
            stroke: new ol.style.Stroke({ color: 'rgba(0,0,0,1)' })
          }),
          text: new ol.style.Text({
            text: dotTable[i].id,
            fill: new ol.style.Fill({color: '#000'}),
            textAlign: 'left',
            offsetX: 10
          })
        }));
        sourceFeatures.addFeatures([feature]);
      }
      var edgeColor=['#333399','#ff9900','#009900','#cc0000'];
      for(var i in edgeTable){
        var fromLoc=dotTable.find(o => o.id === edgeTable[i].fromid).location;
        var toLoc=dotTable.find(o => o.id === edgeTable[i].toid).location;
        var points=new Array(
          trans(fromLoc),trans(toLoc)
        );
        var line=new ol.geom.LineString(points);
        var layerEdge = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [
              new ol.Feature({ geometry: line })
            ]
          }),
          style: [
            new ol.style.Style({
              stroke: new ol.style.Stroke({
                width: 3,
                color: edgeColor[edgeTable[i].type],
                lineDash: [.1, 5]
              }),
              text: new ol.style.Text({
                font: '16px sans-serif',
                text: edgeTable[i].id,
                fill: new ol.style.Fill({color: '#000'})
              })
            })
          ]
        });
        map.addLayer(layerEdge);
      }
    },
    getNearby(location, distance) {
      let string = ''
      if (distance != null) {
        string = `&distance=${distance}`;
      }
      this.$axios.get(`/api/facilitys/around?position=${location}` + string)// !
        .then(res => {
          this.nearby = res.data.data
          for(let i = 0; i < this.nearby.length; i++) {
            switch (this.nearby[i].type) {
              case 1:
                this.nearby[i].type = "教学设施"
                break;
              case 2:
                this.nearby[i].type = "生活设施"
                break;
              case 3:
                this.nearby[i].type = "娱乐设施"
                break;
              case 4:
                this.nearby[i].type = "办公设施"
                break;
              case 5:
                this.nearby[i].type = "地标性建筑"
                break;
              case 6:
                this.nearby[i].type = "室内设施"
                break;
              default:
                this.nearby[i].type = "路口"
                break;
            } 

          }
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    updateData() {
    },
    initAnimation() {
      this.$axios.post(`/api/plan?startid=${this.navigateForm.departure}&endid=${this.navigateForm.arrival}&type=${this.navigateForm.strategy.strategy}&hour=${this.backendTime.hour}&minute=${this.backendTime.minute}&second=${this.backendTime.second}`, this.navigateForm.strategy.pathpoints)
        .then(res => {
          this.getCanteenTable(); // update cateen flows
          lineString.setCoordinates([]);
          pathWeight=[];
          pathWeightSum=[0.];
          this.routeData=res.data.data.path;
          for (let index=0,len=this.routeData.length; index<len; ++index) {
            this.routeData[index].fromname = this.facilitys.find(item=>item.id===this.routeData[index].fromid).name
            this.routeData[index].toname = this.facilitys.find(item=>item.id===this.routeData[index].toid).name
          }
          polyline=new Array(trans(dotTable.find(o=>o.id===this.routeData[0].fromid).location));
          for(var i in this.routeData){
            polyline.push(trans(dotTable.find(o=>o.id===this.routeData[i].toid).location));
            pathWeight.push(this.routeData[i].dist);
            pathWeightSum.push(pathWeightSum[i]+pathWeight[i]);
          }
          startMarker.setGeometry(new ol.geom.Point(polyline[0]));
          startMarker.setStyle(styles['icon']);
          marker.setPosition(polyline[0]);
          stopMarker.setGeometry(new ol.geom.Point(polyline[polyline.length-1]));
          stopMarker.setStyle(styles['icon']);
          route=new ol.geom.LineString(polyline);
          routeFeature.setGeometry(route);
          routeFeature.setStyle(styles['route']);
          lineStringFeature.setGeometry(lineString);
          lineStringFeature.setStyle(styles['route1']);
          mapView.setZoom(18.0);
          mapView.setCenter(polyline[0]);
        }).catch(err => {
          console.log('error', err)
        });
    },
    handlePlay() {
      isPlay = true;
    },
    handlePause() {
      isPlay = false;
    },
    handleRestartTime() {
      this.backendTime = {hour: this.initialTime.getHours(), minute: this.initialTime.getMinutes(), second: this.initialTime.getSeconds()}
    },
    handleReset() {
      isPlay = false;
      this.posisiontNow = 0;
      this.currentTime = 0;
      lineString.setCoordinates(polyline.slice(0,this.posisiontNow+1));
      marker.setPosition(polyline[this.posisiontNow]);
    },
  },
  created() {
    this.getAllData()
    setTimeout(() => {
      try {
          
      } catch (err) {
        console.log(err)
      }
    }, 2000)
  },
  mounted() {
    this.$nextTick(() => {
      var timeAdd = () => {
        this.backendTime = {
          hour: (this.backendTime.hour + Math.floor((Math.floor((this.backendTime.second + 1) / 60) + this.backendTime.minute) / 60)) % 24,
          minute: (this.backendTime.minute + Math.floor((this.backendTime.second + 1) / 60)) % 60,
          second: (this.backendTime.second + 1) % 60,
        }
      }
      setInterval(timeAdd, 100/3);
    })
    // 从数据库获取数据并保存
    this.$axios.get('/api/facilitys/all').then(res => {
      dotTable=res.data.data;
      }).then(res => {
        // 将数据库中的所有边显示在地图上
        this.$axios.get('/api/roads').then(res => {
          edgeTable=res.data.data;
          }).then(res => {
            // 默认不显示数据库信息，如有需要请取消下行注释
            this.displayData();
          }).catch(err=>{
            console.log(err);
          })
      }).catch(res =>{
        console.log(err);
      });

    // 地图对象，有layerRoute和layerFeatures层
    map = new ol.Map({
      target: 'map',
      view: mapView,
      renderer: 'canvas',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
          opacity: 0.6
        }),
        layerFeatures, routeLayer
      ]
    });

    // Popup showing the position the user clicked
    var popup = new ol.Overlay({
      element: document.getElementById('popup'),
    });
    var self = this;
    map.addOverlay(popup);
    map.on('singleclick', function (evt) {
      //this.visible = ture;
      var element = popup.getElement();
      var coordinate = evt.coordinate;
      // console.log(coordinate);
      lastclickp = 1 - lastclickp;
      var EPSG4326coordinate = transform(coordinate, 'EPSG:3857' ,'EPSG:4326');
      // console.log(EPSG4326coordinate);
      lastclick[lastclickp] = EPSG4326coordinate;
      positionSearch = EPSG4326coordinate;
      self.getNearby(EPSG4326coordinate, 50);
      // console.log('click: ' + lastclick[lastclickp] + ' and ' + lastclick[1 - lastclickp]);
      var hdms = toStringHDMS(toLonLat(coordinate));
      $(element).popover('dispose');
      popup.setPosition(coordinate);
      $(element).popover({
        container: element,
        placement: 'top',
        animation: false,
        html: true,
        content: `<p>The location you clicked was: ` + hdms + `</p>`,
      });
      $(element).popover('show');
    });
    
    markerEl = document.getElementById('geo-marker');
    marker = new ol.Overlay({
      offset: [-9, -5],
      element: markerEl,
      stopEvent: false
    });
    map.addOverlay(marker);

    //fire the animation
    var animation = function () {
      if (isPlay && polyline != null && self.posisiontNow < polyline.length) {
        while(self.currentTime > pathWeightSum[self.posisiontNow + 1]){
          self.posisiontNow++;
        }
        if(pathWeightSum[self.posisiontNow + 1] == undefined && self.currentTime >= pathWeightSum[self.posisiontNow]) {
          isPlay = false;
          self.getNearby(transform(polyline[self.posisiontNow], 'EPSG:3857' ,'EPSG:4326'), 50);
          self.timeCount = 0;
          return;
        }
        var displayLine=polyline.slice(0,self.posisiontNow+1);
        var internalTime=self.currentTime-pathWeightSum[self.posisiontNow];        
        internalMarker=[
          polyline[self.posisiontNow][0]+(polyline[self.posisiontNow+1][0]-polyline[self.posisiontNow][0])*internalTime/pathWeight[self.posisiontNow],
          polyline[self.posisiontNow][1]+(polyline[self.posisiontNow+1][1]-polyline[self.posisiontNow][1])*internalTime/pathWeight[self.posisiontNow]
        ];
        displayLine.push(internalMarker);
        lineString.setCoordinates(displayLine);
        marker.setPosition(internalMarker);
        mapView.setCenter(internalMarker);
        self.currentTime += deltaTtime / 1000.0 * 6 * 5;
        if(++self.timeCount % 10 == 0)
          self.getNearby(transform(internalMarker, 'EPSG:3857' ,'EPSG:4326'), 50)
        /* currentTime is 6 times of deltaTtime. 
          * deltaTtime measures by ms, currentTime measures by second.
          * real deltaTtime goes 10s correspond to simulation system currentTime 1min.
          */
      }
    };
    map.once('postcompose', function (event) {
      console.info('postcompose');
      setInterval(animation, deltaTtime);
    });

    // 显示室内结构的多边形
    for(let i in indoorData.elements){
      let polygon = new ol.geom.Polygon(new Array(indoorData.elements[i].nodes));
      polygon.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
      let feature = new ol.Feature(polygon);
      let polygonStyle=new ol.style.Style({
        stroke: new ol.style.Stroke({color: "#4284f5"}),
        // text: new ol.style.Text({text: indoorData.elements[i].tags.name,fill:new ol.style.Fill({color: "#999999"})})
      });
      feature.setStyle(polygonStyle);
      sourceFeatures.addFeatures([feature]);
    }
  },
  updated() {
  },
  destroyed() {
  }
}
</script>

<style>
  body{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  #marker {
    width: 20px;
    height: 20px;
    border: 1px solid #088;
    border-radius: 10px;
    background-color: #0FF;
    opacity: 0.5;
  }

  #vienna {
    text-decoration: none;
    color: white;
    font-size: 11pt;
    font-weight: bold;
    text-shadow: black 0.1em 0.1em 0.2em;
  }

  .popover-body {
    min-width: 276px;
  }

  #geo-marker {
    width: 10px;
    height: 10px;
    border: 1px solid #088;
    border-radius: 5px;
    background-color: #0b968f;
    opacity: 0.8;
  }
</style>
