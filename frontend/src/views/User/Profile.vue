<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col">
                <div class="text-h5">
                  Edit Profile
                </div>
                <div>
                  Complete your profile
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-gutter-sm items-center">
              <div class="col-auto">
                <q-skeleton type="QAvatar" size="100px" animation="none" />
              </div>
              <div class="col">
                <q-btn color="primary" rounded unelevated>
                  Add Photo...
                </q-btn>
              </div>
            </div>

            <div class="row q-gutter-sm q-pt-md">
              <div class="col">
                <q-input v-model="user.username" label="User Name" />
              </div>
              <div class="col">
                <q-input v-model="user.email" label="Email Address" />
              </div>
            </div>

            <div class="row q-gutter-sm">
              <div class="col">
                <q-input v-model="user.firstname" label="First Name" />
              </div>
              <div class="col">
                <q-input v-model="user.lastname" label="Last Name" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn color="primary" unelevated @click="updateProfile">
              Update Profile
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="row q-pt-md q-gutter-sm">
      <div class="col">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col">
                <div class="text-h6">
                  Change Password
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-gutter-sm items-center">
              <div class="col">
                Current Password
              </div>
              <div class="col">
                <q-input v-model="currentPassword" label="Current Passsword" />
              </div>
            </div>

            <div class="row q-gutter-sm items-center">
              <div class="col">
                New Password
              </div>
              <div class="col">
                <q-input v-model="newPassword" label="New Passsword" />
              </div>
            </div>

            <div class="row q-gutter-sm items-center">
              <div class="col">
                Current New Password
              </div>
              <div class="col">
                <q-input v-model="confirmPassword" label="Confirm New Passsword" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              color="primary"
              unelevated
            >
              Change Password
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFeathers } from '@/composites/feathers'
import useAuth from '@/features/Auth/store'

const { api } = useFeathers()

const auth = useAuth()

const user = api.service('users').getFromStore(auth.userId)

const currentPassword = ref()

const newPassword = ref()

const confirmPassword = ref()

const updateProfile = () => {
  user.value.save()
}
</script>
