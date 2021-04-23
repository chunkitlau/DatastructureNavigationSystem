<template>
  <div id="app">
    <el-container>
      <el-main>
        <div id="map"
             class="map"
             style="width: 100%; height: 660px; border: 2px solid black; ">
        </div>
        <div id="geo-marker"></div>
        <div style="display: none;">
          <!-- Popup -->
          <div id="popup" title="">
          </div>
        </div>
        <!--
          <canvas ref="canvas" width="930" height="660">
          </canvas>
  -->
        <!--
          <el-amap ref="myMap" vid="amapDemo" :amap-manager="amapManager">
            <el-amap-marker v-if="marker.cityPosition" v-for="marker in markers" :key='marker.city' :position="marker.cityPosition"></el-amap-marker>
            <el-amap-polyline v-if="polyline.path && polyline.path[0] && polyline.path[1]" v-for="polyline in polylines" :key='polyline.key' :path="polyline.path"></el-amap-polyline>
          </el-amap>
  -->
      </el-main>
      <el-aside width="35%">
        <el-container>
          <el-header height="10%">
            <span>校园导览系统</span>
          </el-header>
          <el-main height="80%">
            <span>Current time: {{ currentTime.day }} day {{ currentTime.hour }} hour</span><br>
            <span>Current position: {{  }} {{  }} </span>
            <el-button-group>
              <el-button @click="handlePlay" type="success" icon="el-icon-video-play">play</el-button>
              <el-button @click="handlePause" type="warning" icon="el-icon-video-pause">pause</el-button>
              <el-button @click="handleRestart" type="danger" icon="el-icon-refresh-left">reset</el-button>
              <el-button @click="setNavigateFormVisible = true" type="primary" icon="el-icon-s-promotion">navigate</el-button>
              <el-button @click="addFacilityFormVisible = true" type="primary" icon="el-icon-circle-plus-outline">add facility</el-button>
              <el-button @click="addPathFormVisible = true" type="primary" icon="el-icon-circle-plus-outline">add path</el-button>
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
                    <el-button @click="addDialogFormVisible = false, addTravelersPlansVisible = true" type="primary" icon="el-icon-circle-plus-outline">add travelers plans</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="addDialogFormVisible = false, addVehiclesTimetableVisible = true" type="primary" icon="el-icon-circle-plus-outline">add vehicles timetable</el-button>
                  </el-row>
                  <el-row>
                    <el-button @click="addDialogFormVisible = false, addVehiclesRiskVisible = true" type="primary" icon="el-icon-circle-plus-outline">add vehicles risk</el-button>
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
              <el-dialog title="adding travelers plans" :visible.sync="addTravelersPlansVisible">
                <el-form :model="form">
                  <el-form-item label="ID" :label-width="formLabelWidth">
                    <el-input v-model="travelersPlansForm.id" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="request time" :label-width="formLabelWidth">
                    <el-input v-model="travelersPlansForm.requestTime" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="departure" :label-width="formLabelWidth">
                    <el-input v-model="travelersPlansForm.departure" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="arrival" :label-width="formLabelWidth">
                    <el-input v-model="travelersPlansForm.arrival" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addTravelersPlansVisible = false, addDialogFormVisible = true">back</el-button>
                  <el-button @click="addTravelersPlansVisible = false">cancel</el-button>
                  <el-button type="primary" @click="addTravelersPlansVisible = false, addTravelersPlans()">confirm</el-button>
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
              <!--
              <el-dialog title="adding path" :visible.sync="addPathFormVisible">
                <span>using the position last click to add facility</span>
                <el-form :model="form">
                  <el-form-item label="name" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="type" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.type" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="departure" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.departure" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="arrival" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.arrival" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="length" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.description" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="length" :label-width="formLabelWidth">
                    <el-input v-model="facilityForm.description" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="addPathFormVisible = false">cancel</el-button>
                  <el-button type="primary" @click="addPathFormVisible = false,addPath()">confirm</el-button>
                </div>
              </el-dialog>
              -->
            </el-button-group>
            <el-tabs type="border-card">
              <el-tab-pane label="travel plan">
                <el-table :data="citiesRisk"
                          height="500"
                          stripe
                          style="width: 100%">
                  <el-table-column prop="city"
                                   label="time"
                                   width="60">
                  </el-table-column>
                  <el-table-column prop="city"
                                   label="name"
                                   width="60">
                  </el-table-column>
                  <el-table-column prop="city"
                                   label="position"
                                   width="120">
                  </el-table-column>
                  <el-table-column label="operation" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini"
                                 @click="editCitiesRisk(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini"
                                 type="danger"
                                 @click="deleteCitiesRisk(scope.$index, scope.row)">delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="facility(nearby)">
                <el-table :data="citiesRisk"
                          height="500"
                          stripe
                          style="width: 100%">
                  <el-table-column prop="city"
                                   label="name"
                                   width="60">
                  </el-table-column>
                  <el-table-column prop="city"
                                   label="type"
                                   width="60">
                  </el-table-column>
                  <el-table-column prop="city"
                                   label="position"
                                   width="120">
                  </el-table-column>
                  <el-table-column prop="city"
                                   label="description"
                                   width="120">
                  </el-table-column>
                  <el-table-column label="operation" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini"
                                 @click="editCitiesRisk(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini"
                                 type="danger"
                                 @click="deleteCitiesRisk(scope.$index, scope.row)">delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="path">
                <el-table :data="vehiclesTimetable"
                          height="500"
                          stripe
                          style="width: 100%">
                  <el-table-column prop="number"
                                   label="name"
                                   width="60">
                  </el-table-column>
                  <el-table-column prop="type"
                                   label="type"
                                   width="60">
                  </el-table-column>
                  <el-table-column prop="departure"
                                   label="departure"
                                   width="90">
                  </el-table-column>
                  <el-table-column prop="arrival"
                                   label="arrival"
                                   width="90">
                  </el-table-column>
                  <el-table-column prop="arrivalTime"
                                   label="length"
                                   width="90">
                  </el-table-column>
                  <el-table-column prop="arrivalTime"
                                   label="transit time"
                                   width="90">
                  </el-table-column>
                  <el-table-column prop="arrivalTime"
                                   label="crowdedness"
                                   width="90">
                  </el-table-column>
                  <el-table-column label="operation" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini"
                                 @click="editVehiclesTimetable(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini"
                                 type="danger"
                                 @click="deleteVehiclesTimetable(scope.$index, scope.row)">delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="timetable">
                <el-table :data="vehiclesTimetable"
                          height="500"
                          stripe
                          style="width: 100%">
                  <el-table-column prop="number"
                                   label="number"
                                   width="90">
                  </el-table-column>
                  <el-table-column prop="type"
                                   label="type"
                                   width="90">
                  </el-table-column>
                  <el-table-column prop="departure"
                                   label="departure"
                                   width="120">
                  </el-table-column>
                  <el-table-column prop="departureTime"
                                   label="departure time"
                                   width="150">
                  </el-table-column>
                  <el-table-column prop="arrival"
                                   label="arrival"
                                   width="120">
                  </el-table-column>
                  <el-table-column prop="arrivalTime"
                                   label="arrival time"
                                   width="120">
                  </el-table-column>
                  <el-table-column label="operation" width="180">
                    <template slot-scope="scope">
                      <el-button size="mini"
                                 @click="editVehiclesTimetable(scope.$index, scope.row)">edit</el-button>
                      <el-button size="mini"
                                 type="danger"
                                 @click="deleteVehiclesTimetable(scope.$index, scope.row)">delete</el-button>
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

var lastclick = [[0,0],[0,0]], lastclickp = 1;
export default {
  name: 'App',
  data() {
    return {
      interval: null,
      map: null,
      timer: 0,
      currentTime: 0,
      setNavigateFormVisible: false,
      addDialogFormVisible: false,
      addTravelersPlansVisible: false,
      addVehiclesTimetableVisible: false,
      addVehiclesRiskVisible: false,
      addFacilityFormVisible: false,
      formLabelWidth: '120px',
      navigateForm: {
        departure: '',
        arrival: '',
        strategy: ''
      },
      facilityForm: {
        name: '',
        type: '',
        description: '',
        position: ''
      },
      travelersPlansForm: {
        id: '',
        requestTime: '',
        departure: '',
        arrival: '',
        plan: ''
      },
      vehiclesTimetableForm: {
        number: '',
        type: '',
        departure: '',
        departureTime: '',
        arrival: '',
        arrivalTime: '',
        risk: ''
      },
      vehiclesRiskForm: {
        vehicle: '',
        risk: ''
      },
      citiesRiskForm: {
        city: '',
        risk: ''
      },
      form: {

      },
      citiesRisk: [],
      vehiclesRisk: [],
      vehiclesTimetable: [],
      travelersStatus: [],
      travelersPlans: [],
      log: [],
      markers: [],
      polylines: [],
      lineArr: [],
      passedPolyline: []
    }
  },
  methods: {
    getCurrentTime() {
      this.$axios.get('/api/current/time')// !
        .then(res => {
          // console.log(res.data.data.currentTime)
          this.currentTime = {
            day: parseInt(res.data.data.currentTime / 24),
            hour: res.data.data.currentTime % 24
          }
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    // setNavigate() {

    // },
    addFacility() {
      console.log(lastclick[lastclickp]);
      this.facilityForm.position = lastclick[lastclickp]
      console.log(this.facilityForm)
      this.$axios.post(`/api/facility?name=${this.facilityForm.name}&type=${this.facilityForm.type}&position=${this.facilityForm.position}&description=${this.facilityForm.description}`)// !
        .then(res => {
          this.citiesRiskForm = {}
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getCitiesRisk() {
      this.$axios.get('/api/cities/risk')// !
        .then(res => {
          this.citiesRisk = res.data.data
          Promise.all(this.citiesRisk.map((value, index) => this.getCitiesLocation(value)))
            .then(res => {
              this.markers = res
            })
            .catch(err => {
              console.log('error', err)
            })
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    addCitiesRisk(index, row) {
      this.$axios.post(`/api/cities/risk?city=${this.citiesRiskForm.city}&risk=${this.citiesRiskForm.risk}`)// !
        .then(res => {
          this.citiesRiskForm = {}
          this.getCitiesRisk()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    editCitiesRisk(index, row) {
      this.$axios.put(`/api/cities/risk?city=${row.city}`)// !
        .then(res => {
          this.getCitiesRisk()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    deleteCitiesRisk(index, row) {
      this.$axios.delete(`/api/cities/risk?city=${row.city}`)// !
        .then(res => {
          this.getCitiesRisk()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getVehiclesRisk() {
      this.$axios.get('/api/vehicles/risk')// !
        .then(res => {
          this.vehiclesRisk = res.data.data
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    addVehiclesRisk(index, row) {
      this.$axios.post(`/api/vehicles/risk?vehicle=${this.vehiclesRiskForm.vehicle}&risk=${this.vehiclesRiskForm.risk}`)// !
        .then(res => {
          this.vehiclesRiskForm = {}
          this.getVehiclesRisk()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    editVehiclesRisk(index, row) {
      this.$axios.put(`/api/vehicles/risk?vehicle=${row.vehicle}`)// !
        .then(res => {
          this.getVehiclesRisk()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    deleteVehiclesRisk(index, row) {
      this.$axios.delete(`/api/vehicles/risk?vehicle=${row.vehicle}`)// !
        .then(res => {
          this.getVehiclesRisk()
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
    getTravelersStatus() {
      this.$axios.get('/api/travelers/status')// !
        .then(res => {
          this.travelersStatus = res.data.data
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getTravelersPlans() {
      this.$axios.get('/api/travelers/plans')// !
        .then(res => {
          this.travelersPlans = res.data.data
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    addTravelersPlans() {
      this.$axios.post(`/api/travelers/plans?id=${this.travelersPlansForm.id}&requesttime=${this.travelersPlansForm.requestTime}&departure=${this.travelersPlansForm.departure}&arrival=${this.travelersPlansForm.arrival}`)// !
        .then(res => {
          this.travelersPlansForm = {}
          this.getTravelersPlans()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    editTravelersPlans(index, row) {
      this.$axios.put(`/api/travelers/plans?id=${row.id}`)// !
        .then(res => {
          this.getTravelersPlans()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    deleteTravelersPlans(index, row) {
      this.$axios.delete(`/api/travelers/plans?id=${row.id}`)// !
        .then(res => {
          this.getTravelersPlans()
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    getAllData() {
      this.getCurrentTime()
      this.getCitiesRisk()
      this.getVehiclesRisk()
      this.getVehiclesTimetable()
      this.getTravelersStatus()
      this.getTravelersPlans()
    },
    updateData() {
      this.getCurrentTime()
      this.getTravelersStatus()
      Promise.all(this.vehiclesTimetable.map((value, index) => this.getCitiesLocation(value)))
        .then(res => {
          this.polylines = res.map((value, index) => {
            value.path = [value.departurePosition, value.arrivalPosition]
            value.key = index
            value.borderWeight = 2
            value.lineJoin = 'round'
            value.showDir = true
            value.strokeColor = '#28F'
            value.strokeOpacity = 1
            value.strokeWeight = 6
            value.strokeStyle = 'solid'
            return value
          })
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    handlePlay() {
      this.$axios.put('/api/current/status?operation=0')// !
        .then(res => {
          // console.log(res.data)
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    handlePause() {
      this.$axios.put('/api/current/status?operation=1')// !
        .then(res => {
          // console.log(res.data)
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    handleRestart() {
      this.$axios.put('/api/current/status?operation=2')// !
        .then(res => {
          // console.log(res.data)
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    loadCitiesName() {
      let stationNamesArray = this.station_names.replace(/@/g, '|').split('|')
      let stationNamesChineseArray = stationNamesArray.filter((value, index) => index % 6 === 2)
      let stationNamesPinyinArray = stationNamesArray.filter((value, index) => index % 6 === 4)
      this.stationNamesPinyinToChinese = new Map(stationNamesPinyinArray.map((value, index) => [value, stationNamesChineseArray[index]]))
      this.citiesNamesPingyinToPosition = new Map()
    },
    getCitiesLocation(item) {
      return new Promise((resolve, reject) => {
        if (item.city !== undefined && item.cityPosition === undefined) {
          let tryMap = this.citiesNamesPingyinToPosition.get(item.city)
          if (tryMap === undefined) {
            this.$axios.get(`/amap/geocode/geo?address=${this.stationNamesPinyinToChinese.get(item.city)}&key=${this.vueAmapKey}`)// !
              .then(res => {
                item.cityPosition = res.data.geocodes[0].location.split(',').map(Number)
                this.citiesNamesPingyinToPosition.set(item.city, item.cityPosition)
                resolve(item)
              })
              .catch(err => {
                reject(err)
              })
          } else {
            item.cityPosition = tryMap
          }
        }
        resolve(item)
      }).then((item) => {
        return new Promise((resolve, reject) => {
          if (item.departure !== undefined && item.departurePosition === undefined) {
            let tryMap = this.citiesNamesPingyinToPosition.get(item.departure)
            if (tryMap === undefined) {
              this.$axios.get(`/amap/geocode/geo?address=${this.stationNamesPinyinToChinese.get(item.departure)}&key=${this.vueAmapKey}`)// !
                .then(res => {
                  item.departurePosition = res.data.geocodes[0].location.split(',').map(Number)
                  this.citiesNamesPingyinToPosition.set(item.departure, item.departurePosition)
                  resolve(item)
                })
                .catch(err => {
                  reject(err)
                })
            } else {
              item.departurePosition = tryMap
            }
          }
          resolve(item)
        })
      }).then((item) => {
        return new Promise((resolve, reject) => {
          if (item.arrival !== undefined && item.arrivalPosition === undefined) {
            let tryMap = this.citiesNamesPingyinToPosition.get(item.arrival)
            if (tryMap === undefined) {
              this.$axios.get(`/amap/geocode/geo?address=${this.stationNamesPinyinToChinese.get(item.arrival)}&key=${this.vueAmapKey}`)// !
                .then(res => {
                  item.arrivalPosition = res.data.geocodes[0].location.split(',').map(Number)
                  this.citiesNamesPingyinToPosition.set(item.arrival, item.arrivalPosition)
                  resolve(item)
                })
                .catch(err => {
                  reject(err)
                })
            } else {
              item.arrivalPosition = tryMap
            }
          }
          resolve(item)
        })
      })
    },
  },
  created() {
    this.getAllData()
    this.loadCitiesName()
    setTimeout(() => {
      try {
          
      } catch (err) {
        console.log(err)
      }
    }, 2000)
  },
  mounted() {
    var bputMainCampus = new ol.View({
      center: [12952250, 4860150],
      zoom: 16.61
    })
    var bputShaheCampus = new ol.View({
      center: [12944600, 4888600],
      zoom: 16.6
    })
    var bputCampus = new ol.View({
      center: [12948425, 4875300],
      zoom: 11.7
    })
    var viewNow = bputCampus;

    var sourceFeatures = new ol.source.Vector(),
      layerFeatures = new ol.layer.Vector({ source: sourceFeatures });

    var lineString = new ol.geom.LineString([]);

    var layerRoute = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [
          new ol.Feature({ geometry: lineString })
        ]
      }),
      style: [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            width: 3, color: 'rgba(0, 0, 0, 1)',
            lineDash: [.1, 5]
          }),
          zIndex: 2
        })
      ],
      updateWhileAnimating: true
    });

    var map = new ol.Map({
      target: 'map',
      view: viewNow,
      renderer: 'canvas',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
          opacity: 0.6
        }),
        layerRoute, layerFeatures
      ]
    });

    var pos = fromLonLat([16.3725, 48.208889]);
    
    // Popup showing the position the user clicked
    var popup = new ol.Overlay({
      element: document.getElementById('popup'),
    });
    map.addOverlay(popup);

    
    map.on('singleclick', function (evt) {
      //this.visible = ture;
      var element = popup.getElement();
      var coordinate = evt.coordinate;
      lastclickp = 1 - lastclickp;
      var EPSG4326coordinate = transform(coordinate, 'EPSG:3857' ,'EPSG:4326');
      lastclick[lastclickp] = EPSG4326coordinate;
      console.log('click: ' + lastclick[lastclickp] + ' and ' + lastclick[1 - lastclickp]);
      var hdms = toStringHDMS(toLonLat(coordinate));
      $(element).popover('dispose');
      popup.setPosition(coordinate);
      $(element).popover({
        container: element,
        placement: 'top',
        animation: false,
        html: true,
        content: `<p>The location you clicked was:</p><code>` + hdms + `</code>`,
      });
      $(element).popover('show');
    });
    

    var markerEl = document.getElementById('geo-marker');
    var marker = new ol.Overlay({
      //positioning: 'center-center',
      offset: [-9, -5],
      element: markerEl,
      stopEvent: false
    });
    map.addOverlay(marker);


    var fill = new ol.style.Fill({ color: 'rgba(255,255,255,1)' }),
      stroke = new ol.style.Stroke({ color: 'rgba(0,0,0,1)' }),
      style1 = [
        new ol.style.Style({
          image: new ol.style.Icon(({
            scale: .7, opacity: 1,
            rotateWithView: false, anchor: [0.5, 1],
            anchorXUnits: 'fraction', anchorYUnits: 'fraction',
            src: '//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
          })),
          zIndex: 5
        }),
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6, fill: fill, stroke: stroke
          }),
          zIndex: 4
        })
      ];


    //a simulated path

    var path = [
      [12952250, 4860150],
      [12944600, 4888600],
      [12949287.297571652,4885310.053422529]
    ];

    var feature1 = new ol.Feature({
      geometry: new ol.geom.Point(path[0])
    }),
      feature2 = new ol.Feature({
        geometry: new ol.geom.Point(path[path.length - 1])
      });

    feature1.setStyle(style1);
    feature2.setStyle(style1);
    sourceFeatures.addFeatures([feature1, feature2]);

    // lineString.setCoordinates(path);


    var i = 0;
    //fire the animation
    map.once('postcompose', function (event) {
      console.info('postcompose');
      this.interval = setInterval(animation, 500);
    });

    var animation = function () {

      if (i < path.length) {
        lineString.setCoordinates(path.slice(0,i+1));
        marker.setPosition(path[i]);
        i++;
      }
    };

  /*
if (this.timer) {
  clearInterval(this.timer)
} else {
  this.timer = setInterval(() => {
    this.updateData()
  }, 1000)
}
*/
  },
  updated() {

  },
  destroyed() {
    // clearInterval(this.timer)
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
