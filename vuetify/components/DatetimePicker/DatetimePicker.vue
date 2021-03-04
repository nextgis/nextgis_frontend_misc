<template>
  <!-- based on https://github.com/darrenfang/vuetify-datetime-picker/blob/master/src/components/DatetimePicker.vue -->
  <v-dialog v-model="display" :width="dialogWidth">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        append-icon="mdi-calendar"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDatetime"
        v-on="readonly ? undefined : on"
        readonly
      >
        <template v-slot:progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            ></v-progress-linear>
          </slot>
        </template>
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-row class="pa-2">
          <v-col>
            <v-text-field
              v-model="dateInput"
              :label="locale.date"
              :rules="dateRules"
              :placeholder="locale.datePlaceholder"
              hide-details
              dense
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-menu
              ref="menu"
              v-model="timeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="timeInput"
                  :label="locale.time"
                  :rules="timeRules"
                  :placeholder="locale.timePlaceholder"
                  hide-details
                  dense
                  outlined
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                ref="timer"
                v-if="timeMenu"
                format="24hr"
                v-model="time"
                full-width
                @click:minute="$refs.menu.save(time)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-date-picker
          v-model="date"
          v-bind="datePickerProps"
          full-width
          no-title
          scrollable
        ></v-date-picker>
        <!-- <v-text-field
              v-model="dateFormatted"
              label="Date"
              hint="MM/DD/YYYY format"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              @blur="date = parseDate(dateFormatted)"

            ></v-text-field> -->
        <!-- <v-tabs fixed-tabs v-model="activeTab">
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>{{ icons.calendar }}</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer" :disabled="dateSelected">
            <slot name="timeIcon">
              <v-icon>{{ icons.time }}</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-model="date"
              v-bind="datePickerProps"
              @input="showTimePicker"
              full-width
            ></v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              class="v-time-picker-custom"
              v-model="time"
              v-bind="timePickerProps"
              full-width
            ></v-time-picker>
          </v-tab-item>
        </v-tabs> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions" :parent="this">
          <v-btn color="primary" text @click.native="clearHandler">{{
            locale.clear
          }}</v-btn>
          <v-btn color="primary" @click="okHandler">{{ locale.ok }}</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" src="./DatetimePicker"></script>

<style>
.v-time-picker-custom .v-picker__title {
  height: 84px;
  padding-top: 10px;
}
</style>