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
        _internalType: 'form',
        name: 'Form 1',
        data: {
          name: 'Bob Cashflow',
          active: true
        },
        _fields: [
          {
            _id: '64b40e66fd77c9b5d159bc6c',
            _internalType: 'field',
            _type: 'row',
            name: 'Row1',
            _columns: [
              {
                _id: '64b40e6b4ab865f040a443fb',
                name: 'Col1',
                _internalType: 'field',
                _type: 'col',
                field: 'col1',
                size: 6,
                _fields: [
                  {
                    _id: '64b40d6aec6b76cac94a91e3',
                    name: 'Input1',
                    _internalType: 'field',
                    _type: 'input',
                    field: 'name',
                    label: 'Name',
                    dense: true,
                    outlined: true,
                    color: 'lime-14',
                    bgColor: 'cyan-7',
                    labelColor: 'teal-11'
                  }
                ]
              },
              {
                _id: '64b40e7b7600abdf0ec85e13',
                name: 'Col2',
                _internalType: 'field',
                _type: 'col',
                size: 6,
                _fields: [
                  {
                    _id: '64b40d708822f84e00862cc9',
                    name: 'Checkbox1',
                    _internalType: 'field',
                    _type: 'checkbox',
                    field: 'active',
                    label: 'Active?',
                    checked: false
                  },
                  {
                    _id: '65203c7b00232ee54684ae43',
                    _internalType: 'field',
                    _type: 'value-box',
                    dense: false,
                    border: {
                      style: 'solid',
                      color: 'rgb(92, 107, 192)',
                      width: 5,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                      radius: {
                        topLeft: '0',
                        topRight: '20px',
                        bottomLeft: '20px',
                        bottomRight: '0'
                      }
                    },
                    modelValue: 6,
                    valueColor: 'grey-8',
                    valueFormat: 'decimal',
                    valueStyle: 'h5',
                    valueDigits: 0,
                    valueCurrencyNarrow: false,
                    color: 'amber-4',
                    labelColor: null,
                    labelStyle: 'h6',
                    icon: 'mdi-chart-line',
                    tagColor: null,
                    diff: 0.85,
                    diffFormat: 'percent',
                    diffDigits: 0,
                    diffCurrencyNarrow: false,
                    diffColor: 'green-6',
                    diffStyle: 'subtitle1',
                    diffIcon: 'mdi-chevron-up',
                    diffIconColor: 'green-6',
                    diffIconSize: 'xs',
                    diffIconSuffix: false,
                    name: 'Value Box1',
                    iconColor: 'blue-grey',
                    value: 8
                  }
                ]
              }
            ],
            gutter: null,
            justify: null,
            items: null,
            hGutter: null,
            vGutter: null
          },
          {
            _id: '650c643d3e4eddf51034ae36',
            _internalType: 'field',
            _type: 'input',
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            rules: [],
            type: 'text',
            maxLength: 0,
            name: 'Input2',
            field: 'stringField',
            label: 'String Field',
            outlined: true,
            dense: true
          },
          {
            _id: '654b9573026ee0db8eb3cc06',
            _internalType: 'field',
            _type: 'label',
            disable: false,
            readonly: false,
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            sizes: {
              maxHeight: '24px'
            },
            pre: false,
            name: 'Label3',
            field: 'randomField'
          },
          {
            _id: '64ff53a9e6ff5e0a454e210f',
            _internalType: 'field',
            _type: 'label',
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            modelValue: '```val(\'name\') || val(\'stringField\')```',
            pre: false,
            name: 'Label1'
          },
          {
            _id: '64ff2e1188c4d6ce604edb5e',
            _internalType: 'field',
            _type: 'label',
            border: {
              style: 'solid',
              color: 'rgb(2, 119, 189)',
              width: 3,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
              radius: {
                topLeft: 0,
                topRight: '50px',
                bottomRight: '50px',
                bottomLeft: 0
              }
            },
            name: 'Label2',
            modelValue: 'This is some cool stuff!!',
            backgroundColor: '#00f57b',
            color: '#d66c00',
            label: 'This is some cool stuff!'
          },
          {
            _id: '650b1a020ba7aff5e945687f',
            _internalType: 'field',
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
                right: 'right'
              },
            },
            tableId: '64b806da03ac5093de3f3e78',
            valueField: '_id',
            columns: [
              {
                field: 'stringField',
                size: 2,
                filterable: true,
                titleClass: 'text-bold'
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
            optionsDense: true
          },
          {
            _id: '6552395d1b954688c350f5de',
            _internalType: 'field',
            _type: 'card',
            _columns: [
              {
                _id: '6552395d1b954688c350f5df',
                _internalType: 'field',
                _type: 'card-section',
                _fields: [
                  {
                    _id: '655239f11b954688c350f70a',
                    _internalType: 'field',
                    _type: 'label',
                    disable: false,
                    readonly: false,
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    label: 'This is card section label',
                    pre: false,
                    name: 'Label4'
                  }
                ],
                horizontal: false,
                border: {
                  style: 'none',
                  color: 'black',
                  width: 1,
                  sides: {
                    top: 'top',
                    bottom: 'bottom',
                    left: 'left',
                    right: 'right'
                  },
                },
              },
              {
                _id: '6552395d1b954688c350f5e0',
                _internalType: 'field',
                _type: 'card-actions',
                _fields: [
                  {
                    _id: '655247237c52da3c764bb1d6',
                    _internalType: 'field',
                    _type: 'button',
                    _columns: [],
                    disable: false,
                    readonly: false,
                    dense: false,
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    label: 'Action',
                    replace: false,
                    loading: false,
                    noCaps: false,
                    noWrap: false,
                    align: 'center',
                    stack: false,
                    stretch: false,
                    round: false,
                    rounded: false,
                    glossy: false,
                    outline: false,
                    flat: true,
                    push: false,
                    square: false,
                    unelevated: false,
                    fab: false,
                    fabMini: false,
                    name: 'Button1'
                  }
                ],
                align: 'right',
                vertical: false,
                border: {
                  style: 'none',
                  color: 'black',
                  width: 1,
                  sides: {
                    top: 'top',
                    bottom: 'bottom',
                    left: 'left',
                    right: 'right'
                  },
                },
              }
            ],
            _fields: [],
            square: false,
            flat: false,
            bordered: false,
            name: 'Card1'
          },
          {
            _id: '6552413283ae0789fdc19691',
            _internalType: 'field',
            _type: 'paragraph',
            disable: false,
            readonly: false,
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            text: 'This is a pretty cool <b>paragraph</b>',
            noRouteFullscreenExit: false,
            square: false,
            flat: false,
            dense: false,
            toolbarOutline: false,
            toolbarPush: false,
            toolbarRounded: false,
            definitions: [],
            toolbar: [
              [
                'left',
                'center',
                'right',
                'justify'
              ],
              [
                'bold',
                'italic',
                'underline',
                'strike'
              ],
              [
                'undo',
                'redo'
              ]
            ],
            name: 'Paragraph1',
            paragraphTag: 'div'
          },
          {
            _id: '65147e49ac6c2ea4619fb7b3',
            _internalType: 'field',
            _type: 'tabs',
            _columns: [
              {
                _id: '65147e44ac6c2ea4619fb79d',
                _internalType: 'field',
                _type: 'tab',
                name: 'Tab1',
                label: 'Tab 1',
                _fields: [
                  {
                    _id: '65525300ae70e3c917e54ccc',
                    _internalType: 'field',
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
                        right: 'right'
                      },
                    },
                    value: 0,
                    angle: 0,
                    indeterminate: true,
                    reverse: false,
                    rounded: false,
                    instantFeedback: false,
                    showValue: false,
                    min: 0,
                    max: 0,
                    color: 'primary',
                    thickness: 0.2,
                    animationSpeed: 0,
                    name: 'Progress1'
                  }
                ],
                badgeValue: '12',
                badgeColor: 'red-7',
                color: 'cyan-14'
              },
              {
                _id: '651482a18cef84c6e338c348',
                _internalType: 'field',
                _type: 'tab',
                name: 'Tab2',
                label: 'Tab 2',
                _fields: [
                  {
                    _id: '651485ac35a1dd68aba32c0e',
                    _internalType: 'field',
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
                        right: 'right'
                      },
                    },
                    color: 'primary',
                    thickness: 0,
                    name: 'Spinner1'
                  }
                ]
              }
            ],
            align: 'left',
            dense: true,
            name: 'Tabs1',
            stretch: false,
            shrink: false,
            noCaps: true,
            inlineLabel: false
          },
          {
            _id: '6554e47c4b35c74868b886ef',
            _internalType: 'field',
            _type: 'chip',
            disable: false,
            readonly: false,
            dense: true,
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            visible: true,
            selected: false,
            label: 'sdas asAds sds',
            clickable: false,
            removable: false,
            square: true,
            outline: true,
            name: 'Chip1'
          },
          {
            _id: '651ae03a8560492cb3961a67',
            _internalType: 'field',
            _type: 'table',
            disable: false,
            readonly: false,
            dense: true,
            border: {
              style: 'solid',
              color: 'black',
              width: 3,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
              radius: {
                topLeft: '20px',
                bottomRight: '20px'
              }
            },
            noRouteFullscreenExit: false,
            grid: false,
            gridHeader: false,
            loading: false,
            columns: [
              {
                _id: '651ae0348560492cb3961a4f',
                name: 'col1',
                label: 'String',
                align: 'left',
                field: 'stringField',
                chip: true,
                color: 'amber-11'
              }
            ],
            visibleColumns: [],
            hideHeader: false,
            hideBottom: false,
            hideSelectedBanner: false,
            hideNoData: false,
            hidePagination: false,
            separator: 'horizontal',
            wrapCells: false,
            expanded: [],
            rows: [],
            pagination: {
              descending: false,
              page: 0,
              rowsPerPage: 0,
              rowsNumber: 0
            },
            rowsPerPageOptions: [
              10,
              25,
              50,
              10
            ],
            binaryStateSort: false,
            flat: true,
            bordered: false,
            square: false,
            virtualScroll: false,
            virtualScrollSliceSize: 30,
            virtualScrollSliceRatioBefore: 1,
            virtualScrollSliceRatioAfter: 1,
            virtualScrollItemSize: 48,
            virtualScrollStickySizeStart: 0,
            virtualScrollStickySizeEnd: 0,
            tableColspan: 0,
            tableId: '64b806da03ac5093de3f3e78',
            hideFilter: true,
            name: 'Table1',
            rowKey: '_id',
            linkFields: [
              {
                fieldname: 'numberField',
                value: '234'
              }
            ],
            extraFields: [
              {
                fieldname: 'numberField',
                value: '234',
                filter: true,
                create: true
              }
            ],
            addButton: 'start',
            addLabel: null,
            temps: true,
            schemaRows: true,
            editable: true,
            removeButton: true,
            actions: [
              {
                label: 'Click test',
                icon: 'mdi-note',
                color: 'blue-14',
                click: '6553c18dce5fa00566256577'
              }
            ],
            query: {}
          },
          {
            _id: '655239f61b954688c350f72e',
            _internalType: 'field',
            _type: 'label',
            disable: false,
            readonly: false,
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            pre: false,
            name: 'Label5'
          },
          {
            _id: '65523c1defd07c30ec39bea8',
            _internalType: 'field',
            _type: 'form-embedded',
            formId: '64b410a0a8e639dab4e3e542',
            name: 'Form Embedded1'
          },
          {
            _id: '655281c1ea66727e607b147c',
            _internalType: 'field',
            _type: 'sidebar',
            _columns: [
              {
                _id: '655281b8ea66727e607b141f',
                _internalType: 'field',
                _type: 'col',
                _fields: [
                  {
                    _id: '655284c94d3a3488cc50a763',
                    _internalType: 'field',
                    _type: 'icon',
                    size: 'md',
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    icon: 'mdi-account-check',
                    left: false,
                    right: false,
                    name: 'Icon1'
                  },
                  {
                    _id: '655284e04d3a3488cc50a7c3',
                    _internalType: 'field',
                    _type: 'label',
                    disable: false,
                    readonly: false,
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    label: 'This is a label',
                    pre: false,
                    name: 'Label8',
                    field: 'name'
                  }
                ],
                virtualScrollItemSize: 2
              }
            ],
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            sizes: {
              minWidth: '0px',
              width: '250px'
            },
            opened: false,
            closeable: true,
            name: 'Sidebar1',
            right: true,
            bordered: true
          }
        ],
        tableId: '64b806da03ac5093de3f3e78',
        query: {
          tableId: '64b806da03ac5093de3f3e78',
          groups: []
        },
        visibleColumns: [
          'stringField',
          'booleanField',
          'numberField'
        ],
        rowsPerPageOptions: [
          10,
          25,
          50,
          10
        ],
        mounted: '653822171a45ca1378d2e974',
        grid: false,
        gridHeader: false,
        hideHeader: false,
        tableCreate: '654a9873b41af5a32367b4a5'
      },
      {
        _id: '64b410a0a8e639dab4e3e542',
        _internalType: 'form',
        name: 'Form 2',
        _fields: [
          {
            _id: '65425bf52429f714434ddf50',
            _internalType: 'field',
            _type: 'toolbar',
            _columns: [
              {
                _id: '65425bd92429f714434ddf49',
                _internalType: 'field',
                _type: 'col',
                _fields: [
                  {
                    _id: '65425c912429f714434ddf65',
                    _internalType: 'field',
                    _type: 'button',
                    disable: false,
                    readonly: false,
                    dense: false,
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    replace: true,
                    loading: false,
                    noCaps: false,
                    noWrap: false,
                    align: 'center',
                    icon: 'mdi-account-child-circle',
                    stack: false,
                    stretch: false,
                    round: false,
                    rounded: false,
                    glossy: false,
                    outline: false,
                    flat: true,
                    push: false,
                    square: false,
                    unelevated: false,
                    fab: false,
                    fabMini: false,
                    name: 'Button3'
                  },
                  {
                    _id: '654260302429f714434de048',
                    _internalType: 'field',
                    _type: 'separator',
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    padding: {
                      left: '2px',
                      right: '2px'
                    },
                    spaced: false,
                    inset: false,
                    vertical: true,
                    name: 'Separator2',
                    color: 'blue-grey-10'
                  },
                  {
                    _id: '65425c972429f714434ddf6a',
                    _internalType: 'field',
                    _type: 'button',
                    disable: false,
                    readonly: false,
                    dense: false,
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    replace: false,
                    loading: false,
                    noCaps: false,
                    noWrap: false,
                    align: 'center',
                    icon: 'mdi-account-multiple',
                    stack: false,
                    stretch: false,
                    round: false,
                    rounded: false,
                    glossy: false,
                    outline: false,
                    flat: true,
                    push: false,
                    square: false,
                    unelevated: false,
                    fab: false,
                    fabMini: false,
                    name: 'Button4'
                  },
                  {
                    _id: '65425d002429f714434ddfa5',
                    _internalType: 'field',
                    _type: 'label',
                    disable: false,
                    readonly: false,
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    label: 'My Bar',
                    pre: false,
                    name: 'Label3'
                  }
                ],
                border: {
                  style: 'none',
                  color: 'black',
                  width: 1,
                  sides: {
                    top: 'top',
                    bottom: 'bottom',
                    left: 'left',
                    right: 'right'
                  },
                },
              }
            ],
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            name: 'Toolbar1'
          },
          {
            _id: '654cfde58fdcaf9c129b5d19',
            _internalType: 'field',
            _type: 'row',
            _columns: [
              {
                _id: '654cfde58fdcaf9c129b5d1a',
                _internalType: 'field',
                _type: 'col',
                _fields: [
                  {
                    _id: '64f8d2ddc5d5795fb8aba99e',
                    name: 'Button1',
                    _internalType: 'field',
                    _type: 'button',
                    border: {
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        right: 'right',
                        left: 'left'
                      },
                      style: 'none',
                      width: 1
                    },
                    label: '```\'Insert\'```',
                    color: 'light-blue-7',
                    align: 'center',
                    click: '64f8d31ec5d5795fb8aba9a5'
                  }
                ],
                border: {
                  style: 'none',
                  color: 'black',
                  width: 1,
                  sides: {
                    top: 'top',
                    bottom: 'bottom',
                    left: 'left',
                    right: 'right'
                  },
                },
                col: 'auto'
              },
              {
                _id: '654cfde58fdcaf9c129b5d1b',
                _internalType: 'field',
                _type: 'col',
                _fields: [
                  {
                    _id: '6527f8cdc1d3405a5c05f724',
                    _internalType: 'field',
                    _type: 'button',
                    disable: false,
                    readonly: false,
                    dense: true,
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    label: 'DOWNLOAD',
                    replace: false,
                    loading: false,
                    noCaps: false,
                    noWrap: false,
                    align: 'center',
                    stack: false,
                    stretch: false,
                    round: false,
                    rounded: false,
                    glossy: false,
                    outline: true,
                    flat: false,
                    push: false,
                    square: false,
                    unelevated: false,
                    fab: false,
                    fabMini: false,
                    click: '6527f8eac1d3405a5c05f727',
                    name: 'Button2',
                    renderWhen: '```variable(\'myVar\') === \'test2\'```'
                  }
                ],
                border: {
                  style: 'none',
                  color: 'black',
                  width: 1,
                  sides: {
                    top: 'top',
                    bottom: 'bottom',
                    left: 'left',
                    right: 'right'
                  },
                },
                col: 'auto'
              }
            ],
            name: 'Row2',
            items: 'center',
            justify: 'center',
            gutter: 'sm',
            hGutter: 'md',
            vGutter: null
          },
          {
            _id: '654cfd948fdcaf9c129b5c43',
            _internalType: 'field',
            _type: 'row',
            _columns: [
              {
                _id: '654cfd948fdcaf9c129b5c44',
                _internalType: 'field',
                _type: 'col',
                _fields: [
                  {
                    _id: '654114d33a5842ebbd6551f6',
                    _internalType: 'field',
                    _type: 'list',
                    _columns: [
                      {
                        _id: '654114cc3a5842ebbd6551f1',
                        _internalType: 'field',
                        _type: 'col',
                        _fields: [
                          {
                            _id: '654114d63a5842ebbd6551f9',
                            _internalType: 'field',
                            _type: 'label',
                            disable: false,
                            readonly: false,
                            border: {
                              style: 'none',
                              color: 'black',
                              width: 1,
                              sides: {
                                top: 'top',
                                bottom: 'bottom',
                                left: 'left',
                                right: 'right'
                              },
                            },
                            label: 'asdasdasdasdasdasd',
                            pre: false,
                            name: 'Label1'
                          }
                        ],
                        name: 'listcol'
                      }
                    ],
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    sizes: {
                      maxHeight: '200px'
                    },
                    virtualScroll: true,
                    virtualScrollHorizontal: false,
                    virtualScrollSliceSize: 0,
                    virtualScrollSliceRatioBefore: 0,
                    virtualScrollSliceRatioAfter: 0,
                    virtualScrollItemSize: 30,
                    virtualScrollStickySizeStart: 0,
                    virtualScrollStickySizeEnd: 0,
                    name: 'List1',
                    loopExpr: '```5000```',
                    horizontal: false
                  }
                ],
                border: {
                  style: 'none',
                  color: 'black',
                  width: 1,
                  sides: {
                    top: 'top',
                    bottom: 'bottom',
                    left: 'left',
                    right: 'right'
                  },
                },
              },
              {
                _id: '654cfd948fdcaf9c129b5c45',
                _internalType: 'field',
                _type: 'col',
                _fields: [
                  {
                    _id: '654114e43a5842ebbd65520c',
                    _internalType: 'field',
                    _type: 'list',
                    _columns: [
                      {
                        _id: '654114cc3a5842ebbd6551f1',
                        _internalType: 'field',
                        _type: 'col',
                        _fields: [
                          {
                            _id: '654114ed3a5842ebbd655221',
                            _internalType: 'field',
                            _type: 'icon',
                            size: 'md',
                            border: {
                              style: 'none',
                              color: 'black',
                              width: 1,
                              sides: {
                                top: 'top',
                                bottom: 'bottom',
                                left: 'left',
                                right: 'right'
                              },
                            },
                            icon: 'mdi-launch',
                            left: false,
                            right: false,
                            name: 'Icon1',
                            field: '_value'
                          },
                          {
                            _id: '654118ee23e1ae45b45e7b5f',
                            _internalType: 'field',
                            _type: 'label',
                            disable: false,
                            readonly: false,
                            border: {
                              style: 'none',
                              color: 'black',
                              width: 1,
                              sides: {
                                top: 'top',
                                bottom: 'bottom',
                                left: 'left',
                                right: 'right'
                              },
                            },
                            pre: false,
                            name: 'Label2',
                            field: '_index',
                            label: 'Index'
                          },
                          {
                            _id: '6541195223e1ae45b45e7b7c',
                            _internalType: 'field',
                            _type: 'separator',
                            border: {
                              style: 'none',
                              color: 'black',
                              width: 1,
                              sides: {
                                top: 'top',
                                bottom: 'bottom',
                                left: 'left',
                                right: 'right'
                              },
                            },
                            spaced: false,
                            inset: false,
                            vertical: false,
                            name: 'Separator1'
                          }
                        ],
                        name: 'listcol'
                      }
                    ],
                    border: {
                      style: 'none',
                      color: 'black',
                      width: 1,
                      sides: {
                        top: 'top',
                        bottom: 'bottom',
                        left: 'left',
                        right: 'right'
                      },
                    },
                    sizes: {
                      maxHeight: '100px'
                    },
                    virtualScroll: false,
                    virtualScrollHorizontal: false,
                    virtualScrollSliceSize: 0,
                    virtualScrollSliceRatioBefore: 0,
                    virtualScrollSliceRatioAfter: 0,
                    virtualScrollItemSize: 24,
                    virtualScrollStickySizeStart: 0,
                    virtualScrollStickySizeEnd: 0,
                    name: 'List2',
                    loopExpr: '```[\'mdi-close\', \'mdi-check\']```',
                    horizontal: false
                  }
                ],
                border: {
                  style: 'none',
                  color: 'black',
                  width: 1,
                  sides: {
                    top: 'top',
                    bottom: 'bottom',
                    left: 'left',
                    right: 'right'
                  },
                },
              }
            ],
            name: 'Row1'
          },
          {
            _id: '655669c26d5bfcda5156f45b',
            _internalType: 'field',
            _type: 'option-group',
            disable: false,
            readonly: false,
            dense: true,
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            value: 'option2',
            keepColor: false,
            type: 'radio',
            leftLabel: false,
            inline: true,
            options: [
              {
                label: 'Option 1',
                value: 'option1',
                disable: false
              },
              {
                label: 'Option 2',
                value: 'option2',
                disable: false
              }
            ],
            name: 'Option Group1'
          }
        ]
      },
      {
        _id: '6516eda4f757c6b33789b6ec',
        _internalType: 'form',
        name: 'Form 3',
        _fields: [
          {
            _id: '6516ee0bf757c6b33789b6f2',
            _internalType: 'field',
            _type: 'icon',
            size: 'xl',
            border: {
              style: 'none',
              color: 'black',
              width: 1,
              sides: {
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right'
              },
            },
            modelValue: 'mdi-ferris-wheel',
            left: false,
            right: false,
            color: 'blue-14',
            name: 'Icon1',
            backgroundColor: null
          }
        ]
      }
    ]
  }, { user: data.auth.user })
}
