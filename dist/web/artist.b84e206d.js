(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{13:function(t,s,i){"use strict";i.r(s);var e=function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("transition",[i("div",{staticClass:"dialog-box"},[i("CloseButton",{on:{close:t.handleClose}}),t._v(" "),i("div",{staticClass:"title"},[i("div",{staticClass:"title-icon"},[t._t("title-icon")],2),t._v(" "),i("p",[t._t("title")],2)]),t._v(" "),i("div",{staticClass:"content"},[i("div",{staticClass:"content-top"},[t._t("content-top")],2),t._v(" "),i("div",{staticClass:"content-bottom"},[t._t("content-bottom")],2)])],1)])};e._withStripped=!0;var a={name:"dialog-box",components:{CloseButton:i(157).a},props:{},methods:{handleClose:function(){this.$emit("close")}}},n=(i(164),i(2)),r=Object(n.a)(a,e,[],!1,null,"b7c944ec",null);r.options.__file="src/components/common/dialog-box.vue";s.default=r.exports},147:function(t,s,i){},148:function(t,s,i){"use strict";var e=function(){var t=this.$createElement,s=this._self._c||t;return s("button",{directives:[{name:"title",rawName:"v-title"}],staticClass:"normal-button",class:{highlight:this.highlight,active:this.active}},[this.iconType?s("Icon",{staticClass:"icon",attrs:{type:this.iconType,size:"sm"}}):this._e(),this._v(" "),s("span",{staticClass:"title"},[this._t("default")],2)],1)};e._withStripped=!0;var a=i(9),n={name:"normal-button",components:{Icon:i(5).a},directives:{Title:a.a},props:{iconType:{type:String},active:{type:Boolean,default:!1},highlight:{type:Boolean,default:!1}}},r=(i(149),i(2)),o=Object(r.a)(n,e,[],!1,null,"1417b078",null);o.options.__file="src/components/common/normal-button.vue";s.a=o.exports},149:function(t,s,i){"use strict";var e=i(147);i.n(e).a},151:function(t,s,i){},152:function(t,s,i){},153:function(t,s,i){},157:function(t,s,i){"use strict";var e=function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"close-button"},[s("div",{staticClass:"close",on:{click:this.handleClickClose}},[s("Icon",{attrs:{type:"close",size:"3xs"}})],1)])};e._withStripped=!0;var a={name:"close-button",components:{Icon:i(5).a},methods:{handleClickClose:function(){this.$emit("close")}}},n=(i(162),i(2)),r=Object(n.a)(a,e,[],!1,null,"441faaeb",null);r.options.__file="src/components/common/close-button.vue";s.a=r.exports},158:function(t,s,i){},159:function(t,s,i){},160:function(t,s,i){"use strict";var e=i(151);i.n(e).a},162:function(t,s,i){"use strict";var e=i(152);i.n(e).a},164:function(t,s,i){"use strict";var e=i(153);i.n(e).a},166:function(t,s,i){},167:function(t,s,i){},199:function(t,s,i){"use strict";var e=function(){var t=this.$createElement,s=this._self._c||t;return s("ScrollArea",{staticClass:"artist-list"},[s("ul",[this._t("default")],2)])};e._withStripped=!0;var a={name:"artist-list",components:{ScrollArea:i(11).a}},n=(i(160),i(2)),r=Object(n.a)(a,e,[],!1,null,"31d7c960",null);r.options.__file="src/components/common/artist-list.vue";s.a=r.exports},201:function(t,s,i){"use strict";var e=i(158);i.n(e).a},203:function(t,s,i){"use strict";var e=i(159);i.n(e).a},205:function(t,s,i){"use strict";var e=i(166);i.n(e).a},207:function(t,s,i){"use strict";var e=i(167);i.n(e).a},284:function(t,s,i){"use strict";i.r(s);var e=function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"artist-filter"})};e._withStripped=!0;var a={name:"artist-filter"},n=(i(207),i(2)),r=Object(n.a)(a,e,[],!1,null,"455710f2",null);r.options.__file="src/components/views/artist/artist-filter.vue";s.default=r.exports},288:function(t,s,i){"use strict";i.r(s);var e=function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"fav-artist"},[i("PageHeader",{attrs:{layout:"icon","icon-type":"light-2","can-edit":!0},on:{edit:t.handleClickEdit}},[i("template",{slot:"title"},[t._v("\n            我加推的歌手\n        ")]),t._v(" "),i("template",{slot:"description"},[t._v("\n            共 "+t._s(t.favArtists.length)+" 位，"+t._s(0===t.bestArtist?"没有主推":"主推 1 位")+"，加推不能等\n        ")])],2),t._v(" "),i("div",{staticClass:"fav-artist-best"},[i("div",{staticClass:"fav-artist-best-title"},[i("p",[t._v("\n                主推\n                "),i("span",{staticClass:"sub-title"},[t.bestArtistData?[t._v("\n                        我永远喜欢"+t._s(t.bestArtistData.name)+"\n                    ")]:[t._v("\n                        还没有确定主推呢\n                    ")]],2)])]),t._v(" "),i("div",{staticClass:"fav-artist-best-content"},[i("ul",[t.bestArtistData?i("ArtistListItem",{staticClass:"fav-artist-best-item",attrs:{artist:t.bestArtistData}}):i("li",{staticClass:"empty"},[i("p",[t._v("空空如也")])])],1)])]),t._v(" "),i("div",{staticClass:"fav-artist-all"},[t._m(0),t._v(" "),i("ArtistList",{staticClass:"fav-artist-all-content",style:t.scrollStyles},[t._l(t.favArtistsData,function(t,s){return i("ArtistListItem",{key:s,staticClass:"fav-artist-all-item",attrs:{artist:t}})}),t._v(" "),0===t.favArtistsData.length?i("li",{staticClass:"empty"},[i("p",[t._v("空空如也")])]):t._e()],2)],1),t._v(" "),i("DialogBox",{directives:[{name:"show",rawName:"v-show",value:t.showEdit,expression:"showEdit"},{name:"click-outside",rawName:"v-click-outside",value:t.handleCloseEdit,expression:"handleCloseEdit"}],staticClass:"fav-artist-edit",style:t.editStyles,on:{close:t.handleCloseEdit},nativeOn:{keypress:function(s){return"button"in s||!t._k(s.keyCode,"enter",13,s.key,"Enter")?t.handleConfirmEdit(s):null}}},[i("Icon",{attrs:{slot:"title-icon",type:"edit",size:"sm"},slot:"title-icon"}),t._v(" "),i("template",{slot:"title"},[i("span",[t._v("我的加推清单")])]),t._v(" "),i("template",{slot:"content-top"},[i("div",{staticClass:"edit-list"},[i("div",{staticClass:"title"},[i("div",{staticClass:"artist"},[i("p",[t._v("歌手")])]),t._v(" "),i("div",{staticClass:"fav"},[i("p",[t._v("加推")])]),t._v(" "),i("div",{staticClass:"best"},[i("p",{attrs:{title:"主推只能选一个喔"}},[t._v("主推")])])]),t._v(" "),i("ScrollArea",{style:t.listStyles},t._l(t.favArtistsData,function(s,e){return i("div",{key:e,staticClass:"item"},[i("div",{staticClass:"artist"},[i("Thumbnail",{staticClass:"artist-thumbnail",attrs:{"is-round":!0,"border-color":"#e1e5e6",size:"25px",src:s.imageUrl}}),t._v(" "),i("p",[t._v(t._s(s.name))])],1),t._v(" "),i("div",{staticClass:"fav"},[i("label",[i("input",{directives:[{name:"model",rawName:"v-model",value:t.myFavArtists,expression:"myFavArtists"}],attrs:{type:"checkbox",title:"加推"+s.name,id:"list-fav-"+s.id},domProps:{value:s.id,checked:Array.isArray(t.myFavArtists)?t._i(t.myFavArtists,s.id)>-1:t.myFavArtists},on:{change:function(i){var e=t.myFavArtists,a=i.target,n=!!a.checked;if(Array.isArray(e)){var r=s.id,o=t._i(e,r);a.checked?o<0&&(t.myFavArtists=e.concat([r])):o>-1&&(t.myFavArtists=e.slice(0,o).concat(e.slice(o+1)))}else t.myFavArtists=n}}})])]),t._v(" "),i("div",{staticClass:"best"},[i("label",[i("input",{directives:[{name:"model",rawName:"v-model",value:t.myBestArtist,expression:"myBestArtist"}],attrs:{type:"radio",disabled:!t.myFavArtists.includes(s.id),title:"主推"+s.name,id:"list-best-"+s.id},domProps:{value:s.id,checked:t._q(t.myBestArtist,s.id)},on:{change:function(i){t.myBestArtist=s.id}}}),t._v(">\n                            ")])])])}))],1)]),t._v(" "),i("template",{slot:"content-bottom"},[i("div",{staticClass:"button-group"},[i("NormalButton",{staticClass:"button",attrs:{"icon-type":"edit",active:!0},nativeOn:{click:function(s){return t.handleConfirmEdit(s)}}},[t._v("\n                    保存\n                ")]),t._v(" "),i("NormalButton",{staticClass:"button",attrs:{"icon-type":"cancel"},nativeOn:{click:function(s){return t.handleCloseEdit(s)}}},[t._v("\n                    放弃\n                ")])],1)])],2)],1)};e._withStripped=!0;var a=i(6),n=i.n(a),r=i(0),o=i.n(r),l=i(1),c=i.n(l),u=i(7),v=i.n(u),h=i(4),d=i(199),m=i(47),f=i(12),p=i(5),_=i(148),A=i(51),b=i(48),C=i(11),y=i(13),g={name:"fav-artist",components:{ArtistList:d.a,Thumbnail:f.a,Icon:p.a,DialogBox:y.default,ScrollArea:C.a,PageHeader:b.a,ArtistListItem:A.a,NormalButton:_.a},directives:{ClickOutside:m.a},data:function(){return{maxItemCount:6,favArtistsData:[],showEdit:!1,myFavArtists:[],myBestArtist:void 0,inspect:!1}},computed:v()({},Object(h.b)("favorite",["favArtists","bestArtist"]),Object(h.b)(["height"]),{bestArtistData:function(){var t=this;return this.favArtistsData.filter(function(s){return s.id===t.bestArtist})[0]},editStyles:function(){return{height:"".concat(40*this.favArtists.length+110,"px"),maxHeight:"".concat(40*this.maxItemCount+110,"px")}},listStyles:function(){return{height:"".concat(40*this.favArtists.length,"px"),maxHeight:"".concat(40*this.maxItemCount,"px")}},scrollStyles:function(){return{height:"".concat(this.height-370,"px")}}}),watch:{favArtists:function(){this.updateMyFavArtists(),this.getData()},bestArtist:function(){this.myBestArtist=this.bestArtist},showEdit:function(t){t?this.$hasher.set("edit"):this.$hasher.remove("edit")}},methods:{getData:function(){var t=c()(o.a.mark(function t(){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.$ajax.getArtistsFullAsync(this.myFavArtists);case 2:this.favArtistsData=t.sent;case 3:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),handleClickEdit:function(){this.showEdit=!0},handleCloseEdit:function(){this.showEdit=!1},handleConfirmEdit:function(){for(var t=this,s=this.favArtists.filter(function(s){return!t.myFavArtists.includes(s)}).sort(function(t,s){return t<s}),i=s.length-1;i>=0;i--)this.$store.dispatch("removeFavArtist",s[i]),this.inspect&&console.log("Removing ".concat(s[i]));this.myFavArtists.includes(this.myBestArtist)?this.$store.dispatch("setBestArtist",this.myBestArtist):this.$store.dispatch("setBestArtist",0),this.showEdit=!1},handleHashChange:function(t){this.showEdit=!0===t.edit},updateMyFavArtists:function(){var t,s=this;(t=this.myFavArtists).push.apply(t,n()(this.favArtists.filter(function(t){return!s.myFavArtists.includes(t)})))}},mounted:function(){this.updateMyFavArtists(),this.myBestArtist=this.bestArtist,this.getData(),this.$hasher.bind(this.handleHashChange),this.handleHashChange(this.$hash)},destroyed:function(){this.$hasher.unbind(this.handleHashChange)}},w=(i(205),i(2)),x=Object(w.a)(g,e,[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"fav-artist-all-title"},[s("p",[this._v("\n                全部\n                "),s("span",{staticClass:"sub-title"},[this._v("\n                排名不分先后\n            ")])])])}],!1,null,"ceb25a80",null);x.options.__file="src/components/views/artist/fav-artist.vue";s.default=x.exports},290:function(t,s,i){"use strict";i.r(s);var e=function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"artist-detail"},[i("PageHeader",{attrs:{layout:"image",imageSrc:t.artist.imageUrl}},[i("template",{slot:"title"},[t._v("\n            "+t._s(t.artist.name)+"\n        ")]),t._v(" "),i("template",{slot:"title-sub"},[t._v("\n            名字和职业\n        ")]),t._v(" "),i("template",{slot:"description-1"},[i("span",[t._v("作品数")]),t._v(" "),i("span",[t._v("专辑数")]),t._v(" "),i("span",[t._v("歌曲数")])]),t._v(" "),i("template",{slot:"description-2"}),t._v(" "),i("template",{slot:"button"},[i("NormalButton",{staticClass:"button",attrs:{"icon-type":"light-"+(t.isFavorite?"2":"1"),highlight:!0,active:t.isFavorite},nativeOn:{click:function(s){return t.handleClickFav(s)}}},[t.isFavorite?[t._v("\n                    已加推\n                ")]:[t._v("\n                    立即加推\n                ")]],2),t._v(" "),i("NormalButton",{staticClass:"button",attrs:{"icon-type":"share"}},[t._v("\n                分享\n            ")])],1)],2),t._v(" "),i("ShowArea",{staticClass:"song-list"},[i("template",{slot:"title"},[t._v("\n            热门歌曲\n        ")]),t._v(" "),t._l(t.songs,function(t,s){return i("SongListItemV",{key:s,staticClass:"song-list-item",attrs:{slot:"content",song:t},slot:"content"})})],2),t._v(" "),i("ShowArea",{staticClass:"album-list"},[i("template",{slot:"title"},[t._v("\n            专辑\n        ")]),t._v(" "),t._l(t.albums,function(t,s){return i("AlbumListItem",{key:s,staticClass:"album-list-item",attrs:{slot:"content",album:t},slot:"content"})})],2)],1)};e._withStripped=!0;var a=i(0),n=i.n(a),r=i(50),o=i.n(r),l=i(1),c=i.n(l),u=i(7),v=i.n(u),h=i(4),d=i(59),m=i(60),f=i(148),p=i(49),_=i(48),A={name:"artist-detail",components:{SongListItemV:d.a,ShowArea:m.a,AlbumListItem:p.a,PageHeader:_.a,NormalButton:f.a},props:["id"],data:function(){return{artist:{},songs:[],albums:[],inspect:!0}},watch:{id:function(){this.getArtist()}},computed:v()({},Object(h.b)("favorite",["favArtists"]),{isFavorite:function(){return this.favArtists.includes(this.artist.id)}}),methods:{getArtist:function(){var t=c()(n.a.mark(function t(){var s,i,e,a,r,l,c=this;return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.$ajax.getArtistsFullAsync(this.id);case 2:return this.artist=t.sent[0],s=this.$ajax.getRecentSongsFullAsync(5),i=this.$ajax.getRecentAlbumsFullAsync(6),t.next=7,Promise.all([s,i]);case 7:e=t.sent,a=o()(e,2),r=a[0],l=a[1],this.songs=r.map(function(t){return v()({},t,{from:{name:"歌手：".concat(c.artist.name),url:c.$route.path}})}),this.albums=l;case 13:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),handleClickFav:function(){this.isFavorite?this.$store.dispatch("removeFavArtist",this.artist.id):this.$store.dispatch("addFavArtist",this.artist.id)}},mounted:function(){this.getArtist()}},b=(i(203),i(2)),C=Object(b.a)(A,e,[],!1,null,"07bca040",null);C.options.__file="src/components/views/artist/artist-detail.vue";s.default=C.exports},291:function(t,s,i){"use strict";i.r(s);var e=function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"artist"},[s("router-view")],1)};e._withStripped=!0;var a={name:"artist"},n=(i(201),i(2)),r=Object(n.a)(a,e,[],!1,null,"46b9f04e",null);r.options.__file="src/components/views/artist/artist.vue";s.default=r.exports}}]);