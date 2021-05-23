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
            <span>Current time: {{ Math.floor(currentTime / 3600) }} hour {{ Math.floor(currentTime / 60) }} minute {{ currentTime }} second</span><br>
            <span>Current position: id = {{ currentPositionID }} name = {{ currentPositionName }} </span>
            <el-button-group>
              <el-button @click="handlePlay" type="success" icon="el-icon-video-play">play</el-button>
              <el-button @click="handlePause" type="warning" icon="el-icon-video-pause">pause</el-button>
              <el-button @click="handleReset" type="danger" icon="el-icon-refresh-left">reset</el-button>
              <el-button @click="setNavigateFormVisible = true" type="primary" icon="el-icon-s-promotion">navigate</el-button>
              <el-button @click="addFacilityFormVisible = true" type="primary" icon="el-icon-circle-plus-outline">add facility</el-button>
              <el-button @click="addRoadFormVisible = true" type="primary" icon="el-icon-circle-plus-outline">add road</el-button>
              <el-dialog title="navigate" :visible.sync="setNavigateFormVisible">
                <el-form :model="form">
                  <el-form-item label="departure" :label-width="formLabelWidth">
                    <el-input v-model="navigateForm.departure" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="arrival" :label-width="formLabelWidth">
                    <el-input v-model="navigateForm.arrival" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="strategy" :label-width="formLabelWidth">
                    <el-input v-model="navigateForm.strategy" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="setNavigateFormVisible = false">cancel</el-button>
                  <el-button type="primary" @click="setNavigateFormVisible = false, setNavigate()">confirm</el-button>
                </div>
              </el-dialog>
              <el-dialog title="adding" :visible.sync="addDialogFormVisible">
                <el-form :model="form">
                  <el-row>
                    <el-button @click="addDialogFormVisible = false, addVehiclesTimetableVisible = true" type="primary" icon="el-icon-circle-plus-outline">add vehicles timetable</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="addDialogFormVisible = false, addCitiesRiskVisible = true" type="primary" icon="el-icon-circle-plus-outline">add cities risk</el-button>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addDialogFormVisible = false">cancel</el-button>
                  <el-button type="primary" @click="addDialogFormVisible = false">confirm</el-button>
                </div>
              </el-dialog>
              <el-dialog title="adding vehicles timetable" :visible.sync="addVehiclesTimetableVisible">
                <el-form :model="form">
                  <el-form-item label="number" :label-width="formLabelWidth">
                    <el-input v-model="vehiclesTimetableForm.number" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="type" :label-width="formLabelWidth">
                    <el-input v-model="vehiclesTimetableForm.type" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="departure" :label-width="formLabelWidth">
                    <el-input v-model="vehiclesTimetableForm.departure" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="departure time" :label-width="formLabelWidth">
                    <el-input v-model="vehiclesTimetableForm.departureTime" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="arrival" :label-width="formLabelWidth">
                    <el-input v-model="vehiclesTimetableForm.arrival" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="arrival time" :label-width="formLabelWidth">
                    <el-input v-model="vehiclesTimetableForm.arrivalTime" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="risk" :label-width="formLabelWidth">
                    <el-input v-model="vehiclesTimetableForm.risk" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addVehiclesTimetableVisible = false, addDialogFormVisible = true">back</el-button>
                  <el-button @click="addVehiclesTimetableVisible = false">cancel</el-button>
                  <el-button type="primary" @click="addVehiclesTimetableVisible = false, addVehiclesTimetable()">confirm</el-button>
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
              <el-tab-pane label="nearby">
                <el-table :data="nearby" height="500" stripe style="width: 100%">
                  <el-table-column prop="dist" label="dist" width="60"></el-table-column>
                  <el-table-column prop="id" label="id" width="60"></el-table-column>
                  <el-table-column prop="name" label="name" width="60"></el-table-column>
                  <el-table-column prop="type" label="type" width="60"></el-table-column>
                  <el-table-column prop="description" label="description" width="120"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="travel plan">
                <el-table :data="routeData.path" height="500" stripe style="width: 100%">
                  <el-table-column prop="id" label="id" width="60"></el-table-column>
                  <el-table-column prop="fromid" label="fromid" width="90"></el-table-column>
                  <el-table-column prop="toid" label="toid" width="60"></el-table-column>
                  <el-table-column prop="type" label="type" width="60"></el-table-column>
                  <el-table-column prop="efficiency" label="efficiency" width="90"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="facilitys">
                <el-table :data="facilitys" height="500" stripe style="width: 100%">
                  <el-table-column prop="id" label="id" width="60"></el-table-column>
                  <el-table-column prop="name" label="name" width="60"></el-table-column>
                  <el-table-column prop="type" label="type" width="60"></el-table-column>
                  <!--
                  <el-table-column prop="location" label="location" width="120"></el-table-column>
                  -->
                  <el-table-column prop="description" label="description" width="120"></el-table-column>
                  <el-table-column label="operation" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="editFacilitys(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini" type="danger" @click="deleteFacilitys(scope.$index, scope.row)">delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="paths">
                <el-table :data="paths" height="500" stripe style="width: 100%">
                  <el-table-column prop="id" label="id" width="60"></el-table-column>
                  <el-table-column prop="type" label="type" width="60"></el-table-column>
                  <el-table-column prop="fromid" label="fromid" width="90"></el-table-column>
                  <el-table-column prop="toid" label="toid" width="90"></el-table-column>
                  <el-table-column prop="efficiency" label="efficiency" width="90"></el-table-column>
                  <!--
                  <el-table-column prop="" label="length" width="90"></el-table-column>
                  <el-table-column prop="" label="transit time" width="90"></el-table-column>
                  <el-table-column prop="" label="crowdedness" width="90"></el-table-column>
                  -->
                  <el-table-column label="operation" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="editPaths(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini" type="danger" @click="deletePaths(scope.$index, scope.row)">delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="timetable">
                <el-table :data="vehiclesTimetable" height="500" stripe style="width: 100%">
                  <el-table-column prop="number" label="number" width="90"></el-table-column>
                  <el-table-column prop="type" label="type" width="90"></el-table-column>
                  <el-table-column prop="departure" label="departure" width="120"></el-table-column>
                  <el-table-column prop="departureTime" label="departure time" width="150"></el-table-column>
                  <el-table-column prop="arrival" label="arrival" width="120"></el-table-column>
                  <el-table-column prop="arrivalTime" label="arrival time" width="120"></el-table-column>
                  <el-table-column label="operation" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="editVehiclesTimetable(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini" type="danger" @click="deleteVehiclesTimetable(scope.$index, scope.row)">delete</el-button>
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
            Copyright © 2021 - present Chunkit Lau; all rights reserved
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

// 地图当前视角
var viewNow = buptShaheCampus;

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
var deltaTtime = 500;
var polyline = null;

export default {
  name: 'App',
  data() {
    return {
      interval: null,
      map: null,
      currentTime: 0,
      posisiontNow: 0,
      setNavigateFormVisible: false,
      addDialogFormVisible: false,
      addTravelersPlansVisible: false,
      addVehiclesTimetableVisible: false,
      addFacilityFormVisible: false,
      addRoadFormVisible: false,
      formLabelWidth: '120px',
      navigateForm: { departure: '', arrival: '', strategy: '' },
      facilityForm: { name: '', type: '', description: '', position: '' },
      roadForm: { type: '', departure: '', arrival: '', efficiency: '' },
      travelersPlansForm: { id: '', requestTime: '', departure: '', arrival: '', plan: '' },
      vehiclesTimetableForm: { number: '', type: '', departure: '', departureTime: '', arrival: '', arrivalTime: '', risk: '' },
      citiesRiskForm: { city: '', risk: '' },
      form: {},
      facilitys: [],
      citiesRisk: [],
      paths: [],
      nearby: [],
      routeData: { path: [{fromid: 0}] },
      vehiclesTimetable: [],
      travelersStatus: [],
      travelersPlans: [],
      log: [],
    }
  },
  computed: {
    currentPosition: function () {
      try {
        return this.facilitys.find(element => element.id == this.routeData.path[this.posisiontNow].fromid);
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
  methods: {
    setNavigate() {
      this.$axios.post(`/api/plan?startid=${this.navigateForm.departure}&endid=${this.navigateForm.arrival}&type=${this.navigateForm.strategy}`)
        .then(res => {
          console.log(res)
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
        })
        .catch(err => {
          console.log('error',err)
        })
    },
    getFacilitys() {
      this.$axios.get('/api/facilitys')// !
        .then(res => {
          this.facilitys = res.data.data
          //this.facilitys = 
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    addFacility() {
      console.log(lastclick[lastclickp]);
      this.facilityForm.position = lastclick[lastclickp]
      console.log(this.facilityForm)
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
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    addRoad() {
      console.log(this.roadForm)
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
    getVehiclesTimetable() {
      this.$axios.get('/api/vehicles/timetable')// !
        .then(res => {
          this.vehiclesTimetable = res.data.data
        })
        .catch(err => {
          console.log('error', err)
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
      this.getFacilitys()
      this.getPaths()
      //this.getVehiclesTimetable()
    },
    displayData() {
      sourceFeatures.clear();
      this.$axios.get('/api/facilitys')
      .then(res => {
        dotTable=res.data.data;
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
      }).then(res => {
        // 将数据库中的所有边显示在地图上
        this.$axios.get('/api/roads')
          .then(res => {
            var edgeColor=['#333399','#ff9900','#009900','#cc0000'];
            edgeTable=res.data.data;
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
          }).catch(err => {
            console.log(err);
          })
      }).catch(err => {
        console.log(err);
      });
    },
    getNearby(location, distance) {
      let string = ''
      if (distance != null) {
        string = `&distance=${distance}`;
      }
      this.$axios.get(`/api/facilitys/around?position=${location}` + string)// !
        .then(res => {
          this.nearby = res.data.data
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    updateData() {
    },
    initAnimation() {
      this.$axios.post(`/api/plan?startid=${this.navigateForm.departure}&endid=${this.navigateForm.arrival}&type=${this.navigateForm.strategy}`)// !
        .then(res => {
          lineString.setCoordinates([]);
          this.routeData=res.data.data;
          console.log(this.routeData)
          polyline=new Array(trans(dotTable.find(o=>o.id===this.routeData.path[0].fromid).location));
          for(var i in this.routeData.path){
            polyline.push(trans(dotTable.find(o=>o.id===this.routeData.path[i].toid).location));
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
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    handlePlay() {
      /*
      if (!isInitAnimation) {
        this.initAnimation();
        isInitAnimation = tue;
      }
      */
      isPlay = true;
    },
    handlePause() {
      isPlay = false;
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
    // 地图对象，有layerRoute和layerFeatures层
    map = new ol.Map({
      target: 'map',
      view: viewNow,
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

    // 将数据库中的所有点显示在地图上
    this.displayData();
    
    markerEl = document.getElementById('geo-marker');
    marker = new ol.Overlay({
      offset: [-9, -5],
      element: markerEl,
      stopEvent: false
    });
    map.addOverlay(marker);

    //fire the animation
    var animation = function () {
      if (polyline != null && self.posisiontNow < polyline.length && isPlay) {
        self.posisiontNow++;
        lineString.setCoordinates(polyline.slice(0,self.posisiontNow+1));
        marker.setPosition(polyline[self.posisiontNow]);
        self.currentTime += deltaTtime / 1000.0 * 6;
        /* currentTime is 6 times of deltaTtime. 
          * deltaTtime measures by ms, currentTime measures by second.
          * real deltaTtime goes 10s correspond to simulation system currentTime 1min.
          */
      }
    };
    map.once('postcompose', function (event) {
      console.info('postcompose');
      this.interval = setInterval(animation, deltaTtime);
    });
  },
  updated() {
  },
  destroyed() {
  }
}
</script>

<style>

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
