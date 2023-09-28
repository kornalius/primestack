import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'

export default async (app: Application, data: AnyData) => {
  info('  - forms')

  // eslint-disable-next-line no-param-reassign
  data.forms = {}
  // eslint-disable-next-line no-param-reassign
  data.forms.admin = await app.service('forms').create({
    list: [
      {
        _id: '64b410a0a8e639dab4e3e541',
        name: 'Form 1',
        data: {
          name: 'Bob Cashflow',
          active: true,
        },
        _fields: [
          {
            _id: '64b40e66fd77c9b5d159bc6c',
            name: 'Row1',
            _type: 'row',
            _columns: [
              {
                _id: '64b40e6b4ab865f040a443fb',
                name: 'Col1',
                _type: 'col',
                field: 'col1',
                size: 6,
                _fields: [
                  {
                    _id: '64b40d6aec6b76cac94a91e3',
                    name: 'Input1',
                    _type: 'input',
                    field: 'name',
                    label: 'name',
                    dense: true,
                    outlined: true,
                  },
                ],
              },
              {
                _id: '64b40e7b7600abdf0ec85e13',
                name: 'Col2',
                _type: 'col',
                size: 6,
                _fields: [
                  {
                    _id: '64b40d708822f84e00862cc9',
                    name: 'Checkbox1',
                    _type: 'checkbox',
                    field: 'active',
                    label: 'Active?',
                  },
                ],
              },
            ],
          },
          {
            _id: '650c643d3e4eddf51034ae36',
            _type: 'input',
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right',
              },
              radius: {},
            },
            padding: {},
            margin: {},
            rules: [],
            type: 'text',
            maxLength: 0,
            name: 'Input2',
            field: 'stringField',
            label: 'String Field',
            dense: true,
            outlined: true,
          },
          {
            _id: '64ff53a9e6ff5e0a454e210f',
            _type: 'label',
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right',
              },
              radius: {},
            },
            padding: {},
            margin: {},
            modelValue: '```val(\'name\') || val(\'stringField\')```',
            styling: [],
            pre: false,
            name: 'Label1',
          },
          {
            _id: '64ff2e1188c4d6ce604edb5e',
            _type: 'label',
            border: {
              style: 'solid',
              color: 'rgb(51, 105, 30)',
              width: 3,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right',
              },
              radius: {
                topLeft: 0,
                topRight: 50,
                bottomRight: 50,
                bottomLeft: 0,
              },
            },
            padding: {},
            margin: {},
            styling: [],
            name: 'Label2',
            modelValue: 'This is some cool stuff!!',
            backgroundColor: 'rgb(51, 105, 30)',
            color: 'rgb(238, 238, 237)',
          },
          {
            _id: '650b1a020ba7aff5e945687f',
            _type: 'lookup-select',
            dense: true,
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right',
              },
              radius: {},
            },
            padding: {},
            margin: {},
            tableId: data.tables.admin.list[0]._id,
            valueField: '_id',
            columns: [
              {
                field: 'stringField',
                size: 2,
                filterable: true,
                titleClass: 'text-bold',
              },
              {
                field: 'numberField',
                size: 3,
                filterable: true,
                titleClass: 'text-bold'
              }
            ],
            clearable: true,
            outlined: true,
            name: 'Lookup-select1',
            labelField: 'stringField',
          },
          {
            _id: '65147e49ac6c2ea4619fb7b3',
            _type: 'tabs',
            _columns: [
              {
                _id: '65147e44ac6c2ea4619fb79d',
                _type: 'tab',
                name: 'Tab1',
                label: 'Tab 1',
                _fields: [
                  {
                    _id: '651485a835a1dd68aba32c0c',
                    _type: 'progress',
                    size: 'sm',
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right',
                      },
                      radius: {},
                    },
                    padding: {},
                    margin: {},
                    modelValue: 0,
                    indeterminate: true,
                    color: 'primary',
                    thickness: 0.2,
                    animationSpeed: 0,
                    name: 'Progress1',
                  }
                ],
                badgeValue: 12,
              },
              {
                _id: '651482a18cef84c6e338c348',
                _type: 'tab',
                name: 'Tab2',
                label: 'tab 2',
                _fields: [
                  {
                    _id: '651485ac35a1dd68aba32c0e',
                    _type: 'spinner',
                    size: 'sm',
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right',
                      },
                      radius: {},
                    },
                    padding: {},
                    margin: {},
                    color: 'primary',
                    thickness: 0,
                    name: 'Spinner1',
                  }
                ]
              }
            ],
            align: 'left',
            dense: true,
            name: 'Tabs1',
          },
        ],
        tableId: data.tables.admin.list[0]._id.toString(),
        query: {
          tableId: data.tables.admin.list[0]._id.toString(),
          groups: [
            {
              criterias: [
                {
                  fieldId: data.tables.admin.list[0].fields[0]._id.toString(),
                  op: '=',
                  value: '```\'A\'```',
                  logicOp: 'and',
                },
              ],
              logicOp: 'and',
            },
          ],
        },
      },
      {
        _id: '64b410a0a8e639dab4e3e542',
        name: 'Form 2',
        _fields: [
          {
            _id: '64f8d2ddc5d5795fb8aba99e',
            name: 'Button1',
            _type: 'button',
            padding: {},
            margin: {},
            label: 'Insert',
            color: 'light-blue-7',
            align: 'center',
            click: data.actions.admin.list[0]._id.toString(),
          },
        ],
      },
    ]
  }, { user: data.auth.user })
}
