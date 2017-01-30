module.exports = function() {
  var colorPalette = ["#E44951","#73ac71","#abc5e9", "#bfbca7", "#868d99", "#97bfb7", "#9a7a84", "#f18080", "#6d90bf", "#d7c876", "#70c6e5", "#ddd2cb", "#c494a2"];
  return {
    regex: {
      uid: /^[a-z][_a-z0-9]*$/,
      underscores: /_{2,}/g, // find 2 or more consecutive underscores.
      alphaNumericOnly: /\W/g
    },
    clientConfig: {
      functionality:{
        systemRoles: {
          enabled: true
        }
      }
    },
    api_version: "v1",
    env_url: {
      stag: "stag-contentstack.built.io",
      prod: "contentstack.built.io"
    },
    braintree: {
      key: {
        dev: "MIIBCgKCAQEA/ke5+DNsQqFlkbJYu06SVvy5EmkqJP4DxdmdCMRzQXEI/Ifc5k/1ouV/sjGoEgZpXoII7UWHToV9ihxbLglDZyEsD0kVZC1wrymwJ4fL74eNejAYXB6LkLvjtIBsTBFCZBaOMNm0FENZKZ4eDV59gU1Snu/qyjC9gf3RrLyN+Si719ZPTgjpDEHsy6qs3QnA7O5N//lpnMk0F/3uxYM/KbRqzoxn+MSF/Eyd4aznhvcHjKHCzGrm/U+PdobdpbHtSmcDkO3xXEuhYpsRweuuuYQdju9ja1p+1J19PtB0fITuXD9USbLk6qBuMIheVHa90R9Y4+TExn3H4RLKEtabZQIDAQAB",
        prod: "MIIBCgKCAQEAoUtttRcU85V0ayPptLEsEgXjyD9UYJ08KTOFojkV4Lg6kAMX/LOPJa4jmS9EeoqHXRl8bI0+kYumPHbUCD/m6ZTk0EsSaC2ZP7cTa25a1lEs9mRnxA9ZRIK+1mc3b01K5Gs1KFr1UptfB/EvzLxJHS6djx22ZF7ZazG4/oWXLqbPy3V43xkLQ8U49dtAxO/eoHTw8Ve9mjXINtSENeKWrNXhrUUvuJkJ7igRgL+Yp/LCAnzLWN/9oEsGLVx/0Rj/o/xt/MMv6+71tNLFC3VPivGnMaL301HI2IUxCZ70c3ZTyt1+dCAyTbkTiW8kl8PITROtmbYK63BO0NxQdaQ22QIDAQAB"
      }
    },
    analytics: {
      defaults: {
        funnelQuery: {
          name: "",
          events: [],
          query: {},
          webui_payload: [{
            event_uid: "",
            query: {
              data: []
            }
          }, {
            event_uid: "",
            query: {
              data: []
            }
          }]
        },
        eventSearchParams: {
          event: {
            only: {
              name: [],
              category: []
            }
          },
          //include_event_details: false,
          unit: "day"
        },
        charts: {
          line: {
            chart: {
              type: 'line',
              zoomType: 'x',
              backgroundColor: 'transparent'
            },
            legend: {             
              enabled:true,
              useHTML:true,              
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'top',
              itemMarginTop:10,
              itemMarginBottom: 5,
              itemDistance:-15,
              maxHeight:100,
              x: 0,
              y: -10,
              navigation: {
                activeColor: '#3E576F',
                animation: true,
                arrowSize: 8,
                inactiveColor: '#CCC',
                style: {
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '12px'
                }
              }
            },
            title: {
              text: '',
            },
            subtitle: {
              text: '',
            },
            xAxis: {
              type: 'datetime',
              //categories: this.rawGraphData["series"],
              maxZoom: 14 * 24 * 3600000,
              title: {
                text: ''
              },
              dateTimeLabelFormats: {
                day: '%b %e'
              }
            },
            yAxis: {
              title: {
                text: 'Events count'
              },
              gridLineColor: '#E2E2E2',
              min: 0
            },
            tooltip: {
              valueSuffix: '',
              formatter: function() {
                var color = this.series.color;
                return '<small>' + Highcharts.dateFormat("%b %e, %Y", this.x) + '</small><br/><div style="color: ' + color + '">' + this.series['name'] + ' : <b>' + this.y + '</b></div>';
              },
            },
            credits: {
              enabled: false
            }
          },
          pie: {
            chart: {
              type: 'pie',
              backgroundColor: 'transparent'
            },
            title: {
              text: ''
            },
            subtitle: {
              text: ''
            },
            xAxis: {
              categories: []
            },
            yAxis: {
              title: {
                text: 'Events count'
              },
              gridLineColor: '#E2E2E2'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer'
              }
            },
            tooltip: {
              formatter: function() {
                return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
              }
            },
            credits: {
              enabled: false
            }
          },
          bar: {
            chart: {
              type: 'column',
              marginRight: 25,
              backgroundColor: 'transparent'
            },           
            title: {
              text: ''
            },
            subtitle: {
              text: ''
            },
            xAxis: {
              title: {
                margin: 30,
                text: 'Events count'
              },
              categories: [],
              labels: {
                rotation: 0
              }
            },
            yAxis: {
              gridLineWidth: 0,
              //tickColor: 'black',
              tickLength: 5,
              tickWidth: 1,
              tickPosition: 'outside',
              labels: {
                align: 'right',
                x:-12,
                y:5
              },
              lineWidth:1,
              title: {
                margin: 30,
                text: 'Events count'
              },
              gridLineColor: '#E2E2E2'
            },            
            tooltip: {
              /*formatter: function () {
                var self = this;
                var result = this.points.filter(function( obj ) {
                 return obj.series.name ==='data';
                });
                if(result) {
                  return 'The value for <b>' + this.x +
                         '</b> is <b>' + result[0].y + '</b>';
                }
                else {
                  return '';
                }
              },*/
              shared: true,
              useHTML: true,
              valueDecimals: 0,
              headerFormat: '<small>{point.key}</small><table>',
              pointFormat: '<tr><td style="color: {series.color}">Count: </td>' + '<td><b>{point.y}</b></td></tr>',
              footerFormat: '</table>',
            },
            lang: {
              noData: "No data is availabe to display user information"
            },
            noData: {
              position: {
                align: 'center',
                verticalAlign:'middle'
              }
            },
            credits: {
              enabled: false
            },
            legend: {
              enabled: false
            }
          }
        }
      }
    },
    queryLimit: 50,
    charts: {
      colorPalette: colorPalette,
      canvas:true,
      defaults: {
        line: {
          chart: {
            type: 'line',
            zoomType: 'x',
            backgroundColor: 'transparent'
          },
          title: {
            align: "left",
            text: '',
            margin: 25
          },
          subtitle: {
            text: '',
          },
          xAxis: {
            type: 'datetime',
            gridLineWidth: 0,
            // gridLineColor: '#f1f1f1'
            //categories: this.rawGraphData["series"],
            maxZoom: 14 * 24 * 3600000,
            title: {
              text: ''
            },
            dateTimeLabelFormats: {
              day: '%b %e',
              month: '%b %y',
              year: '%Y'
            },
            labels: {
              enabled: true
            }
          },
          yAxis: {
            gridLineWidth: 0,
            title: {
              text: 'Count'
            },
            labels: {
              enabled: true
            },
            min: 0
          },
          tooltip: {
            valueSuffix: '',
            formatter: function() {
              var color = this.series.color;
              return '<small>' + Highcharts.dateFormat("%b %e, %Y", this.x) + '</small><br/><div>' + this.series['name'] + ' : <b>' + this.y + '</b></div>';
            },
          },
          credits: {
            enabled: false
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            borderWidth: 0
          }
        },
        area : {
          chart: {
            type: 'area',
            zoomType: 'x',
            backgroundColor: 'transparent'
          },
          lang: {
            noData:'Currently there is no data availabe to display'
          },          
          title: {
            align: "left",
            text: '',
            // margin: 25
          },          
          subtitle: {
            text: '',
          },
          yAxis: {
            lineWidth: 1,
            lineColor:'#DCDCDD',
            title: {
              text: 'Count'
            },
            labels: {
              enabled: true
            },
            min: 0
          },
          xAxis: {
            type: 'datetime',
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor:'#DCDCDD',
            // gridLineColor: '#f1f1f1'
            //categories: this.rawGraphData["series"],
            maxZoom: 14 * 24 * 3600000,
            title: {
              text: ''
            },
            dateTimeLabelFormats: {
              day: '%b %e',
              month: '%b %y',
              year: '%Y'
            },
            labels: {
              enabled: true
            }
          },
          credits: {
           enabled: false
          },
          tooltip: {
            valueSuffix: '',
            formatter: function() {
              var color = this.series.color;
              return '<small>' + Highcharts.dateFormat("%b %e, %Y", this.x) + '</small><br/><div>' + this.series['name'] + ' : <b>' + this.y + '</b></div>';
            },
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            borderWidth: 0
          }
        },        
        donut: {
          chart: {
            type: 'pie',
            marginTop:-10,
            marginBottom:-20,
            backgroundColor:'transparent'
          },
          lang: {
           noData: "No data is availabe to display user information"
          },
          title: {
            text: ""
          },
          subtitle: {
            text: ""
          },
          plotOptions: {
            pie: {
             size:'76%',
             innerSize: '56%'
            }
          },
          tooltip: {
            formatter: function() {
              return '<b>' + this.point.name + '</b>: ' + this.y;
            }
          },
          credits: {
           enabled: false
          },
          series: [{
            type: 'pie',            
            data: [],
            dataLabels: {
              enabled: false
            }
          }],
        }
      }
    },
    applications: {
      app: {
        version : 2,
        /*
          Default SYS ACL for application.
          Used when creating a new application.
        */
        SYS_ACL: {
          others: {
            invite: false,
            sub_acl: {
              create: false,
              read: false,
              update: false,
              delete: false
            }
          },
          roles: []
        },

        /*
          System roles:Dev manager role object -
          The "dev_manager" key gets replaced with the dev manager role uid.
          The object is then added to the above SYS_ACL object inside the roles object.
        */
        SYS_ACL_ROLES: {
          dev_manager: {
            invite: true,
            sub_acl: {
              create: true,
              read: true,
              update: true,
              delete: true
            }
          }
        },

        /*
          Default System roles and their respective ACL.
        */
        systemRoles: {
          dev_manager: {
            name: 'Dev manager'
          },
          content_manager: {
            name: 'Content manager'
          },

          /*
            Used in configure system roles ACL overlay. Application > Settings > Collaborators and roles > Roles
            The class permissions SYS_ACL object gets extended with the below default SYS_ACL object 
          */
          classesDefaultAcl: {
            read: false,
            update: false,
            delete: false,
            sub_acl: {
              read: true,
              update: true,
              delete: true,
              create: true
            }
          }
        },

        classes: {
          
          /*
            Default SYS ACL for classes.
            Used when creating a new class.
          */
          SYS_ACL: {
            roles: [],
            others: {
              read: false,
              update: false,
              delete: false,
              sub_acl: {
                read: false,
                update: false,
                delete: false,
                create: false,
              }
            }
          },

          /*
            System roles:Dev manager and Content manager role objects -
            The "dev_manager" key gets replaced with the dev manager role uid.
            The "content_manager" key gets replaced with the content manager role uid.
            The updated objects are then added to the above SYS_ACL object inside the roles object.
          */
          SYS_ACL_ROLES: {
            dev_manager: {
              read: true,
              update: true,
              delete: true,
              sub_acl: {
                read: true,
                update: true,
                delete: true,
                create: true
              }
            },
            content_manager: {
              read: true,
              update: false,
              delete: false,
              sub_acl: {
                read: true,
                update: true,
                delete: true,
                create: true
              }
            }
          }
        },
        uploads :{

          /*
            Default SYS ACL for classes.
            Used when creating a new class.
          */
          SYS_ACL: {
            roles: [],
            others: {
              read: true,
              update: true,
              delete: true,
              sub_acl: {
                read: true,
                create: true,
                update: true,
                delete: true
              }
            }
          },
          DEFAULT_ACL:{
            roles:[],
            others :[
                      {
                        read: true,
                        create: true,
                        update: true,
                        delete: true
                      }
                  ]
          },

          /*
            System roles:Dev manager and Content manager role objects -
            The "dev_manager" key gets replaced with the dev manager role uid.
            The "content_manager" key gets replaced with the content manager role uid.
            The updated objects are then added to the above SYS_ACL object inside the roles object.
          */
          SYS_ACL_ROLES: {
            dev_manager: {
              read: true,
              update: true,
              delete: true,
              sub_acl: {
                read: true,
                update: true,
                delete: true,
                create: true
              }
            },
            content_manager: {
              read: true,
              update: false,
              delete: false,
              sub_acl: {
                read: true,
                update: true,
                delete: true,
                create: true
              }
            }
          }
        }
      }
    },
    classes: {
      inbuiltClasses:["built_io_installation_data", "built_io_application_user", "built_io_application_user_role"],
      creationSteps: ['info', 'fields', 'configuration'],
      defaultClassData: {
        uid: '',
        title: '',
        schema: [],
        abilities: {
          create_object: true,
          delete_all_objects: true,
          delete_object: true,
          get_all_objects: true,
          get_one_object: true,
          update_object: true
        },
        DEFAULT_ACL: {
          others: {
            create: true,
            read: true
          },
          roles: [],
          users: []
        }
      },
      inbuiltFields: [{
        uid: "uid",
        data_type: "text",
        display_name: "UID",
      }, {
        uid: "created_at",
        data_type: "isodate",
        display_name: "Created at"
      }, {
        uid: "updated_at",
        data_type: "isodate",
        display_name: "Updated at"
      },{
        uid: "tags",
        data_type: "text",
        display_name: "tags"
      }]
    },
    objects: {
      defaults: {
        ACL: {
            disable: false,
            roles: [],
            users: [],
            others: {}
        }
      }
    },
    uploads: {
      defaults: {
        ACL: {
            disable: false,
            roles: [],
            users: [],
            others: {}
        }
      }
    },
    queryBuilder: {
      defaults: {
        group: {
          _key: '$and',
          _value: [{
            _key: '',
            _value: {},
            fieldData: {
              name: '',
              currentQueryPath: [],
              currentField: {}
            }
          }]
        },
        row: {
          _key: '',
          _value: {},
          fieldData: {
            name: '',
            currentQueryPath: [],
            currentField: {}
          }
        }
      }
    },
    googleMaps: {
      key: null,
      defaults: {
        lat: 37.74045209829323,
        lng: -122.4431164995849
      }
    },
    eventsQueryBuilder: {
      defaults: {
        group: {
          _key: '$or',
          _value: [{
            _key: '',
            _value: {},
            rowData: {
              datatype: 'string'
            }
          }]
        },
        row: {
          _key: '',
          _value: {},
          rowData: {
            datatype: 'string'
          }
        }
      }
    },



    deviceType: [{
      "id": "ios",
      "text": "iOS"
    }, {
      "id": "android",
      "text": "Android"
    }, {
      "id": "other",
      "text": "other"
    }],
    timezones: [{
      "id": "-12:00",
      "text": "(GMT-12:00) Eniwetok, Kwajalein"
    }, {
      "id": "-11:00",
      "text": "(GMT-11:00) Midway Island, Samoa"
    }, {
      "id": "-10:00",
      "text": "(GMT-10:00) Hawaii"
    }, {
      "id": "-09:00",
      "text": "(GMT-09:00) Alaska"
    }, {
      "id": "-08:00",
      "text": "(GMT-08:00) Pacific Time (US & Canada)"
    }, {
      "id": "-07:00",
      "text": "(GMT-07:00) Mountain Time (US & Canada)"
    }, {
      "id": "-06:00",
      "text": "(GMT-06:00) Central Time (US & Canada)"
    }, {
      "id": "-05:00",
      "text": "(GMT-05:00) Eastern Time (US & Canada)"
    }, {
      "id": "-04:00",
      "text": "(GMT-04:00) Atlantic Time (Canada), Caracas, La Paz"
    }, {
      "id": "-03:30",
      "text": "(GMT-03:30) Newfoundland"
    }, {
      "id": "-03:00",
      "text": "(GMT-03:00) Brazil, Buenos Aires, Georgetown"
    }, {
      "id": "-02:00",
      "text": "(GMT-02:00) Mid-Atlantic"
    }, {
      "id": "-01:00",
      "text": "(GMT-01:00) Azores, Cape Verde Islands"
    }, {
      "id": "+00:00",
      "text": "(GMT+00:00) Western Europe Time, London, Lisbon, Casablanca"
    }, {
      "id": "+01:00",
      "text": "(GMT+01:00) Berlin, Copenhagen, Madrid, Paris"
    }, {
      "id": "+02:00",
      "text": "(GMT+02:00) Kaliningrad, South Africa"
    }, {
      "id": "+03:00",
      "text": "(GMT+03:00) Baghdad, Riyadh, Moscow, St. Petersburg"
    }, {
      "id": "+03:30",
      "text": "(GMT+03:30) Tehran"
    }, {
      "id": "+04:00",
      "text": "(GMT+04:00) Abu Dhabi, Muscat, Baku, Tbilisi"
    }, {
      "id": "+04:30",
      "text": "(GMT+04:30) Kabul"
    }, {
      "id": "+05:00",
      "text": "(GMT+05:00) Ekaterinburg, Islamabad, Karachi, Tashkent"
    }, {
      "id": "+05:30",
      "text": "(GMT+05:30) Mumbai, Kolkata, Chennai, New Delhi"
    }, {
      "id": "+05:45",
      "text": "(GMT+05:45) Kathmandu"
    }, {
      "id": "+06:00",
      "text": "(GMT+06:00) Almaty, Dhaka, Colombo"
    }, {
      "id": "+06:30",
      "text": "(GMT+06:30) Yangon (Rangoon)"
    }, {
      "id": "+07:00",
      "text": "(GMT+07:00) Bangkok, Hanoi, Jakarta"
    }, {
      "id": "+08:00",
      "text": "(GMT+08:00) Beijing, Perth, Hong Kong, Singapore"
    }, {
      "id": "+09:00",
      "text": "(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk"
    }, {
      "id": "+09:30",
      "text": "(GMT+09:30) Adelaide, Darwi"
    }, {
      "id": "+10:00",
      "text": "(GMT+10:00) Eastern Australia, Guam, Vladivostok"
    }, {
      "id": "+11:00",
      "text": "(GMT+11:00) Magadan, Solomon Islands, New Caledonia"
    }, {
      "id": "+12:00",
      "text": "(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka"
    }]
  }
}