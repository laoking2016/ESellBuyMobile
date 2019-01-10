<template>
    <div>
        <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
            <h1 class="mui-title">竞价说明</span></h1>
        </header>
        <div class="mui-content" style="padding:10px;margin-top:45px;">
            <h3>拍片描述标准</h3>
            <h4>邮品类品相</h4>
            <table border="1">
                <thead>
                    <tr>
                        <th style="width:75px;">中文名称</th>
                        <th style="width:40px;">符号</th>
                        <th>描述</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-bind:key="map.name" v-for="map in maps">
                        <td align="center">{{map.name}}</td>
                        <td align="center">{{map.mark}}</td>
                        <td>{{map.description}}</td>
                    </tr>
                </tbody>
            </table>
            <h4>纸钞类品相</h4>
            <table border="1">
                <thead>
                    <tr>
                        <th style="width:40px;">符号</th>
                        <th>描述</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-bind:key="paper.mark" v-for="paper in pagers">
                        <td align="center">{{paper.mark}}</td>
                        <td>{{paper.description}}</td>
                    </tr>
                </tbody>
            </table>
            <h4>购买流程</h4>
            <ol>
                <li v-bind:key="step" v-for="step in steps">{{step}}</li>
            </ol>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                maps:[
                    {
                        name: '全品',
                        mark: 'XF',
                        description: '品相与发行品相差无几，色泽鲜艳，齿孔整齐，纸张允许有极细小纸点和极轻微软折等细小瑕疵。（背胶是原胶，由于时间原因可自然发黄但必须非常均匀；连张邮票齿孔允许轻微软折，金银粉邮票金银粉保存完好允许局部细小氧化。）'
                    },
                    {
                        name: '上品',
                        mark: 'F-VF',
                        description: '票品整体感觉完美，色泽鲜艳，纸张允许有纸点，轻微软折等。（有轻微发黄、污、拉毛、露白、短齿等，背胶是原胶，允许阴阳黄，胶不匀，胶折；连张邮票齿孔间允许有折痕但没有撕开，不影响到邮票本身，金银粉邮票金银粉允许轻微氧化，邮票允许贴纸；解放前票品允许发黄，部分胶，无胶或后胶。）'
                    },
                    {
                        name: '中上品',
                        mark: 'F',
                        description: '票品整体感觉较好，色泽基本鲜艳，齿孔基本整齐，纸张允许有折痕等。（有发黄，发霉，部分胶，贴片，或无胶，后胶，缺齿，揭薄，裂口，脱色，褪色等；连张邮票可以撕开，金银粉邮票金银粉允许氧化。）'
                    },
                    {
                        name: '中品',
                        mark: 'G',
                        description: '品整体感觉一般，没有严重的外伤及缺陷。（在中上品品级的基础上允许色泽感觉相对陈旧，有相当程度的缺齿、缺角、撕裂、褪色、揭薄、折痕等。）'
                    },
                    {
                        name: '差品',
                        mark: 'P',
                        description: '票品有伤残或严重缺陷。（存在严重缺齿、缺角、撕裂、褪色、揭薄、硬折、破损等，或尺寸规格差异明显。）'
                    },
                    {
                        name: '修补品',
                        mark: 'RD',
                        description: '经过人为修补的票品。（经过人为的修补处理，如补色、刮戳、换底、拼补等）'
                    }
                ],
                pagers: [
                    {
                        mark: 'UNC+',
                        description: '完全未使用。纸币保存极好，状态与发行时无异。票面坚挺无折痕， 没有有任何黄斑脏点和人为修补处理。'
                    },
                    {
                        mark: 'UNC',
                        description: '未使用。状态良好与绝品接近，唯因年代久远或保存不当造成纸张少许的变色或污染；可能有1 ~ 2处极微小的票角轻折或磨圆的现象,允许票面尺寸有1mm左右误差。'
                    },
                    {
                        mark: 'AU+',
                        description: '近未使用。肉眼看起来可能是未流通票，但有 1条轻微的竖折痕或1 ~ 2处的票角轻折和磨圆现象。'
                    },
                    {
                        mark: 'AU',
                        description: '近未使用。肉眼看起来可能是未流通票，允许不超过 2条轻微的竖折痕或1条较明显的竖折痕，且票角有1 ~ 2处轻折或磨圆；可能有人为处理和压平的现象。'
                    },
                    {
                        mark: 'XF+',
                        description: '票品有较明显的流通痕迹。有不超过3条的竖折痕和较明显的票角折痕与磨圆；可能有人为处理和压平的现象。'
                    },
                    {
                        mark: 'XF',
                        description: '票品有较明显的流通痕迹。有不超过3条的竖折痕，并允许其中1条为横折痕或死折，可能有人为处理和压平的现象。'
                    },
                    {
                        mark: 'VF',
                        description: '票品有明显流通的痕迹。票面已污染软垂，并有4 ~ 5条的折痕和边角的小裂口。'
                    },
                    {
                        mark: 'F',
                        description: '票品有长期流通的痕迹。票面有多处折痕，并有较严重的污染、软垂、撕裂、中心孔等问题。'
                    },
                    {
                        mark: 'VG',
                        description: '票品状态与F品相近。但票面图案已褪色和磨损，并可能出现缺角的现象。'
                    },
                    {
                        mark: 'P',
                        description: '票品状态欠佳。票面图案模糊且完全软垂，并出现断裂和整片缺损等严重问题'
                    }
                ],
                steps:[
                    "所有参与拍卖者必须登记成为会员",
                    "本拍卖出价结算为人民币（外币按当时汇率计算）",
                    "本拍卖所有拍品保真保品。如果实物与图不符签收后3日内包退。",
                    "买家需付成交价的3%佣金，（中国内地包申通或顺丰到付，香港/澳门及海外地区包香港平邮，挂号另外加收20元，或香港店取）",
                    "拍品成交后，5天内可以通过微信、香港银行转账或PAYPAL (额外5%附加费)付款，付款确认后3个工作天内发货。",
                    "拍卖结束后逾期（超过5天，不超过10天）未完成付款的，将会被额外收取额外每件10元的逾期行政费，如超过10天不付款，有关成交将被取消，该用户账号将被警告，如果再出现不付款，则取消有关账号竞拍资格。",
                    "拍卖可以免费保存最多15天，超过15天则需另外收取保管费，每项0.5元1日。",
                    "所有拍品都有详细描述跟图片，请群友仔细查阅后竞价 ，出价无悔。",
                    "本公司拥有最终解释权，如对拍卖有疑问可以联系本公司微信号yibuysell。"
                ]
            }
        }
    }
</script>

<style>

</style>