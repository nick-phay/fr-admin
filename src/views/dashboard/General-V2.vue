<template>
  <div>
    <v-container fluid class="pt-0 grid-list-xl">
      <section-tooltip
        :title="$t('message.generalDashboard')"
        :tooltip="$t('message.dashboardOverview')"
      ></section-tooltip>
      <indexes-block />
      <v-row>
        <app-card
          :heading="$t('message.visitorCollection')"
          colClasses="col-xl-8 col-lg-7 col-md-7 col-sm-6 col-12"
          customClasses="mb-0 sales-widget"
          :fullBlock="false"
        >
          <visitors-collection
            :xLabel="$t('message.byTimes').split(', ')"
            :yLabel="$t('message.hundredUnits')"
          />
        </app-card>
        <app-card
          colClasses="col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12"
          :heading="$t('message.visitorsummaries')"
          customClasses="general-dashboard-doughnut-chart"
        >
          <visitor-stat
            :total="Number(this.totalLogs)"
            :labels="visitorTypes"
            :data="[filteredByTypes[0].length, filteredByTypes[1].length]"
            :bgColor="[ChartConfig.color.lightGrey, ChartConfig.color.primary]"
          />
        </app-card>
      </v-row>
      <!-- Pass vs Fail temperature -->
      <v-row>
        <app-card
          :heading="$t('message.temperatureScreening')"
          colClasses="col-xl-8 col-lg-7 col-md-7 col-sm-6 col-12 flex"
          customClasses="mb-0 sales-widget"
        >
          <general-column-chart />
          <v-row class="cart-wrap hidden-only pl-6">
            <v-col cols="2" class="d-custom-flex">
              <span class="mr-2">
                <i class="zmdi zmdi-invert-colors primary--text"></i>
              </span>
              <p class="mb-0">
                <span class="d-block fs-14 fw-bold">52</span>
                <span class="d-block fs-12 grey--text fw-normal">{{$t('message.pass')}}</span>
              </p>
            </v-col>
            <v-col cols="2" class="d-custom-flex">
              <span class="mr-2">
                <i class="zmdi zmdi-invert-colors-off error--text"></i>
              </span>
              <p class="mb-0">
                <span class="d-block fs-14 fw-bold">49</span>
                <span class="d-block fs-12 grey--text fw-normal">{{$t('message.failed')}}</span>
              </p>
            </v-col>
            <v-col cols="4" class="d-custom-flex">
              <span class="mr-2">
                <i class="zmdi zmdi-male-female success--text"></i>
              </span>
              <p class="mb-0">
                <span class="d-block fs-14 fw-bold">101</span>
                <span
                  class="d-block fs-12 grey--text fw-normal"
                >{{$t('message.totalScreeningPassed')}}</span>
              </p>
            </v-col>
            <v-col cols="4" class="d-custom-flex">
              <span class="mr-2">
                <i class="zmdi zmdi-nature-people error--text"></i>
              </span>
              <p class="mb-0">
                <span class="d-block fs-14 fw-bold">101</span>
                <span
                  class="d-block fs-12 grey--text fw-normal"
                >{{$t('message.totalScreeningFailed')}}</span>
              </p>
            </v-col>
          </v-row>
        </app-card>
        <app-card
          :heading="$t('message.statisticsByDay')"
          colClasses="col-xl-4 col-lg-5 col-md-5 col-sm-6 col-12"
          customClasses="mb-0 sales-widget"
        >
          <index-statistics />
        </app-card>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { ChartConfig } from "Constants/chart-config";
import { groupByKey } from "Helpers/helpers"

import IndexesBlock from "../commons/fr-indexes-block";
import VisitorsCollection from "../fr-charts/GeneralVisitorsCollectionV1";
import VisitorStat from "../fr-detection-logs/VisitorStat";
import GeneralColumnChart from "../fr-charts/GeneralColumnChart";
import IndexStatistics from "../commons/fr-statistics";

export default {
  data() {
    return {
      totalLogs: Number,
      visitorTypes: [],
      ChartConfig,
    };
  },
  components: {
    IndexesBlock,
    VisitorsCollection,
    VisitorStat,
    GeneralColumnChart,
    IndexStatistics,
  },
  mounted() {
    this.totalLogs = this.objDLOffline.rows.length;
    Object.keys(this.groupByType).forEach((key) => {
      this.visitorTypes.push(key);
    });
  },
  computed: {
    ...mapGetters(["fDLO", "fDetectionLogsOnline1", "fDetectionLogsOffline"]),
    objDLO: {
      get: function () {
        return this.fDLO;
      },
      set: function () {
        return this.fDLO;
      },
    },
    objDLOffline: {
      get: function () {
        return this.fDetectionLogsOffline;
      },
      set: function () {
        return this.fDetectionLogsOffline;
      },
    },
    filteredByTypes() {
      let arrRU = [],
        arrGuest = [];

      arrRU = this.objDLOffline.rows.filter(
        (item) => item.type.toLowerCase().trim() === "stranger"
      );
      arrGuest = this.objDLOffline.rows.filter(
        (item) => item.type.toLowerCase().trim() === "employee"
      );

      return [arrRU, arrGuest];
    },
    groupByType() {
      return groupByKey(this.objDLOffline.rows, "type");
    },
    
  },
  methods: {},
};
</script>