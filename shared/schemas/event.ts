import { Type } from '@feathersjs/typebox'
import ExType from '../extypes'

export const schema = Type.Object({
  _id: ExType.Id(),
  // current user id who performs the action
  userId: Type.Optional(ExType.Id()),
  // owner of the custom table the action is performed on
  ownerId: Type.Optional(ExType.Id()),
  // action type ('find', 'get', 'create', 'update', 'patch', 'remove')
  method: Type.String(),
  // service name
  service: Type.String(),
  // document id the action is performed on
  docId: Type.Optional(ExType.Id()),
  // timestamp
  time: Type.Number(),
  // query from the params
  query: Type.Optional(Type.Object({})),
  // data being passed
  data: Type.Optional(Type.Object({})),
}, { $id: 'Event', additionalProperties: false })

// for special user tables
export const eventFields = [
  {
    name: 'userId',
    type: 'objectid',
    readonly: true,
    queryable: true,
  },
  {
    name: 'ownerid',
    type: 'objectid',
    readonly: true,
    queryable: true,
  },
  {
    name: 'method',
    type: 'string',
    readonly: true,
    queryable: true,
  },
  {
    name: 'service',
    type: 'string',
    readonly: true,
    queryable: true,
  },
  {
    name: 'docid',
    type: 'objectid',
    readonly: true,
    queryable: true,
  },
  {
    name: 'time',
    type: 'number',
    readonly: true,
    queryable: true,
  },
]

export const eventTable = {
  service: 'events',
  methods: ['get', 'find'],
  created: false,
  updated: false,
  softDelete: false,
  user: false,
  fields: eventFields,
  indexes: [],
}
