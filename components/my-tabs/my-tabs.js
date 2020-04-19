Component({
    data: {},
    properties: {
        tabs: {
            type: Array,
            value: []
        }
    },
    methods: {
        onTabsChange(e) {
            // 通过dataset获取索引
            console.log(e);

            let { index } = e.currentTarget.dataset

            // 触发父组件自定义事件把index传过去
            this.triggerEvent('tabschange', { index })
        }
    }
})