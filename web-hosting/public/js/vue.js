Vue.component("nav-bar", {
    template: 
    `
        <div class="row" id="whole-bar">
                <div class="col-md">
                    <div class="input-group mb-3" id="inputSearchDiv">
                        <input type="text" class="form-control" placeholder="Search for a video" aria-label="Recipient's username" aria-describedby="button-addon2" id="inputSearch">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="submit">Search</button>
                        </div>
                    </div>
                </div>
                <div class="col-md" id="navTitle">
                Neutrino
                </div>
                <div class="col-md">
                    <div class="row" id="nested">
                        <div class="col-sm">First item</div>
                        <div class="col-sm">Second item</div>
                        <div class="col-sm">Third item</div>
                        <div class="col-sm">Fourth item</div>
                    </div>
                </div>
            </div>
        </div>
    `
})
Vue.component("video-div",{
    template:
    `
    <div class="row">
        <div class="col-md" id="videoDiv">   
            <video src="../public/test.mp4" width="100%" heigth="100%" controls id="current"></video>        
        </div>
        <div class="col" id="titleDesc">   
            <div class="row">
                <div class="col" id="videoTitle">{{title}}</div>
            </div>
            <div class="row">
                <div class="col" id="videoDesc">
                    {{description}}
                </div>
            </div>
        </div>
    
    </div>
    ` ,
    data() {
        return{
            title:"Test title",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus libero a molestie lobortis. Nam condimentum id risus at tristique. Mauris in nisl egestas, hendrerit sem eu, aliquam nulla. Curabitur sodales blandit nisi at fringilla. Mauris egestas massa ut interdum tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean ut tellus massa. Proin ut malesuada nibh. Phasellus lacinia arcu sed est pretium, at gravida nibh aliquam. Fusce cursus leo id lorem cursus, in dictum ligula consectetur. Mauris erat turpis, volutpat semper posuere a, tincidunt vel dolor. Donec tempor faucibus nunc, vitae rhoncus nibh imperdiet fermentum. Fusce ultrices varius nunc, eget finibus massa facilisis sed. Aliquam orci elit, scelerisque a leo sit amet, bibendum vulputate velit. Nullam eleifend, magna a tincidunt tempor, mauris ipsum porta elit, semper porta nisl felis ut orci. Praesent ullamcorper condimentum massa at bibendum. "
        }
    }
})
var vm=new Vue({
    el:"#container",
})