export default {
  dbName: "img",                          // *数据库名称
  version: 1.1,                                 // 数据库版本号（默认为当前时间戳）
  tables: [                                   // *数据库的表，即ObjectStore
    {
      tableName: "img",                 // *表名
      option: { keyPath: "name" },          // 表配置，即ObjectStore配置，此处指明主键为id
      indexs: [                           // 数据库索引（建议加上索引）
        {
          key: "name",                  // *索引名
          option:{                    // 索引配置，此处表示该字段不允许重复
            unique: true
          }
        },
        {
          key: "url"
        },
        {
          key: "width"
        },
        {
          key: "height"
        },
        {
          key: 'date'
        }
      ]
    }
  ]
};
