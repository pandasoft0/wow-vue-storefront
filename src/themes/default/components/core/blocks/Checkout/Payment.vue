<template>
  <div class="payment pt20">
    <div class="row pl20">
      <div class="col-xs-1 col-sm-2 col-md-1">
        <div
          class="number-circle lh35 cl-white brdr-circle align-center weight-700"
          :class="{ 'bg-cl-th-accent' : isActive || isFilled, 'bg-cl-tertiary' : !isFilled && !isActive }"
        >
          1
        </div>
      </div>
      <div class="col-xs-11 col-sm-9 col-md-11">
        <div class="row mb15">
          <div class="col-xs-12 col-md-7" :class="{ 'cl-bg-tertiary' : !isFilled && !isActive }">
            <h3 class="m0 mb5">
              {{ $t('Complete your booking') }}
            </h3>
          </div>
          <div class="col-xs-12 col-md-5 pr30">
            <div class="lh30 flex end-lg" v-if="isFilled && !isActive">
              <a href="#" class="cl-tertiary flex" @click.prevent="edit">
                <span class="pr5">
                  {{ $t('Edit payment') }}
                </span>
                <i class="material-icons cl-tertiary">edit</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl20" v-if="isActive">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-11 col-sm-9 col-md-10">
        <div class="row" v-if="isActive">

          <div class="mb30 mt15">
              <VueCtkDateTimePicker color="#4dba87" no-button-now no-header locale="en" id="order_time" name="order_time" v-model="order_time" minute-interval="30"></VueCtkDateTimePicker>
          </div>

          <base-input
            class="col-xs-12 mb10"
            type="text"
            name="street-address"
            :placeholder="$t('Street name, House/Apartment number *')"
            v-model.trim="payment.streetAddress"
            @blur="$v.payment.streetAddress.$touch()"
            autocomplete="address-line1"
            :validations="[{
              condition: $v.payment.streetAddress.$error && !$v.payment.streetAddress.required,
              text: $t('Field is required')
            }]"
          />


          <base-input
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="city"
            :placeholder="$t('City *')"
            v-model.trim="payment.city"
            @blur="$v.payment.city.$touch()"
            autocomplete="address-level2"
            :validations="[
              {
                condition: $v.payment.city.$error && !$v.payment.city.required,
                text: $t('Field is required')
              },
              {
                condition: $v.payment.city.$error && $v.payment.city.required,
                text: $t('Please provide valid city name')
              }
            ]"
          />

          <base-input
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="state"
            :placeholder="$t('State / Province')"
            v-model.trim="payment.state"
            autocomplete="address-level1"
          />

          <base-input
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="zip-code"
            :placeholder="$t('Zip-code *')"
            v-model.trim="payment.zipCode"
            @blur="$v.payment.zipCode.$touch()"
            autocomplete="postal-code"
            :validations="[
              {
                condition: $v.payment.zipCode.$error && !$v.payment.zipCode.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.payment.zipCode.minLength,
                text: $t('Zip-code must have at least 3 letters.')
              }
            ]"
          />
          <base-input
            name="countries"
            type="hidden"
            v-model="payment.country"
          />
          <base-input
            class="col-xs-12 mb10"
            type="text"
            name="phone-number"
            :placeholder="$t('Phone Number')"
            v-model.trim="payment.phoneNumber"
            autocomplete="tel"
          />

          <div class="col-xs-12">
            <h4>
              {{ $t('Payment method') }}
            </h4>
          </div>
          <div v-for="(method, index) in paymentMethods" :key="index" class="col-md-6">
            <label class="radioStyled"> {{ method.title ? method.title : method.name }}
              <input
                type="radio"
                :value="method.code"
                name="payment-method"
                v-model="payment.paymentMethod"
                @change="$v.payment.paymentMethod.$touch(); changePaymentMethod();"
              >
              <span class="checkmark" />
            </label>
          </div>
          <span class="validation-error" v-if="!$v.payment.paymentMethod.required">{{ $t('Field is required') }}</span>
        </div>
      </div>
    </div>
    <div class="row" v-if="isActive">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-12 col-sm-9 col-md-11">
        <div class="row">
          <div class="col-xs-12 col-md-8 px20 my30">
            <button-full
              @click.native="sendDataToCheckout"
              data-testid="paymentSubmit"
              :disabled="$v.payment.$invalid"
            >
              {{ $t('Go review the order') }}
            </button-full>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl20" v-if="!isActive && isFilled">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-12 col-sm-9 col-md-11">
        <div class="row fs16 mb35">
          <div class="col-xs-12 h4">

            <p>
              {{ payment.city }} {{ payment.zipCode }}
            </p>
            <p>
              <span v-if="payment.state">{{ payment.state }}, </span>
              <span>{{ getCountryName() }}</span>
            </p>
            <div v-if="payment.phoneNumber">
              <span class="pr15">{{ payment.phoneNumber }}</span>
              <tooltip>{{ $t('Phone number may be needed by carrier') }}</tooltip>
            </div>
            <p v-if="generateInvoice">
              {{ payment.company }} {{ payment.taxId }}
            </p>
            <div class="col-xs-12">
              <h4>{{ $t('Payment method') }}</h4>
            </div>
            <div class="col-md-6 mb15">
              <label class="radioStyled"> {{ getPaymentMethod().title }}
                <input type="radio" value="" checked disabled name="chosen-payment-method">
                <span class="checkmark" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { required, minLength } from 'vuelidate/lib/validators'
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators'
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import ButtonFull from 'theme/components/theme/ButtonFull'
import Tooltip from 'theme/components/core/Tooltip'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

export default {
  data() {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date +' '+ time;

    return {
      order_time: dateTime
    }
  },
  components: {
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    ButtonFull,
    Tooltip
  },

  mixins: [Payment],
  computed: {
    countryOptions () {
      return this.countries.map((item) => {
        return {
          value: item.code,
          label: item.name
        }
      })
    }
  },
  validations () {
    if (!this.generateInvoice) {
      return {
        payment: {
          country: {
            required
          },
          streetAddress: {
            required,
            unicodeAlphaNum
          },
          zipCode: {
            required,
            minLength: minLength(3),
            unicodeAlphaNum
          },
          city: {
            required,
            unicodeAlpha
          },
          paymentMethod: {
            required
          }
        }
      }
    } else {
      return {
        payment: {
          company: {
            required,
            unicodeAlphaNum
          },
          taxId: {
            required,
            minLength: minLength(3)
          },
          country: {
            required
          },
          streetAddress: {
            required,
            unicodeAlphaNum
          },
          zipCode: {
            required,
            minLength: minLength(3),
            unicodeAlphaNum
          },
          city: {
            required,
            unicodeAlpha
          },
          paymentMethod: {
            required
          }
        }
      }
    }
  }
}
</script>
