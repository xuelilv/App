define(['text!../html/service.html','text!../json/site.json','swiper'], function(html,SiteJson,Swiper) {
	var pScroll = null,cScroll = null,aScroll = null;
	var SiteJson = JSON.parse(SiteJson);
	var cityData = null;
	var city_arr = _.where(SiteJson,{type:0});
	var area_arr = _.where(city_arr,{'name':'北京市'})[0].sub;
	city_arr.unshift({'name':'请选择'});
	var model_s = Backbone.Model.extend({
			
	});
	var collection_s  = Backbone.Collection.extend({
		model:model_s
	});
	var list_province = new collection_s();
	var list_city = new collection_s();
	var list_aera = new collection_s();
	
	var view_item = Backbone.View.extend({
		tagName: "div",
		className:"item",
		initialize:function(){
			this.listenTo(this.model, "add", this.render);
		},
		render:function(){
			var name = this.model.get("name"); 
			var childEl = (name !== "" && name.length > 6) ? 
					("<div class='swiper-slide' style='line-height:20px'>"+name+"<\/div>")
					: ("<div class='swiper-slide'>"+name+"<\/div>");
			this.$el.html(childEl);
			return this;
		}
	});
	var view_Aera = Backbone.View.extend({
		el:"#wrap-area",
		els:"",
		initialize:function(){
			this.listenTo(list_aera, "reset", this.addAll);
			list_aera.reset(area_arr);
			
		},
		render:function(){
			this.$el.html(this.els);
			if(aScroll != null){
				aScroll.update();
			}
		},
		addAll:function(){
			this.els = "";
			this.len = list_aera.length;
			list_aera.each(this.addItem, this);
		},
		addItem:function(item,index){
			var pro = new view_item({model:item});
			this.els += pro.render().el.innerHTML;
			if(index >= (this.len-1)){
				this.render();
			}
		}
	});
	var view_City = Backbone.View.extend({
		el:"#wrap-city",
		els:"",
		initialize:function(){
			this.listenTo(list_city, "reset", this.addAll);
			list_city.reset(city_arr);
		},
		render:function(){
			this.$el.html(this.els);
			if(cScroll != null){
				cScroll.update();
			}
		},
		addAll:function(){
			this.els = "";
			this.len = list_city.length;
			list_city.each(this.addItem, this);
		},
		addItem:function(item,index){
			var pro = new view_item({model:item});
			this.els += pro.render().el.innerHTML;
			if(index >= (this.len-1)){
				this.render();
			}
		}
	});
	
	var view_Province = Backbone.View.extend({
		el:"#wrap-province",
		els:"",
		initialize:function(){
			this.listenTo(list_province, "reset", this.addAll);
			list_province.reset(_.where(SiteJson,{type:1}));
			
		},
		render:function(){
			this.$el.html(this.els);
			if(pScroll != null){
				pScroll.update();
			}
		},
		addAll:function(){
			this.len = list_province.length;
			list_province.each(this.addItem, this);
		},
		addItem:function(item,index){
			var pro = new view_item({model:item});
			this.els += pro.render().el.innerHTML;
			if(index >= (this.len-1)){
				this.render();
			}
		}
	});
	
	//
	var serviceModel = Backbone.Model.extend({
		defaults: {
			name: "",
			phone: "",
			address: "",
			problem: "",
			code: "0"
		}
	});

	var serviceView = Backbone.View.extend({
		el: "#views",
		data: null,
		type:1,//申请单类型
		template: _.template(html),
		events: {
			"touchstart .mask": "mask",
			"click .serviceBtn": "serviceBtn",
			"touchstart .radio_server":"selectRadio",
			"touchstart #select_address":"initSwiper",
			"touchstart #scroll_save":"saveScroll"
		},
		
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.model.set({
				code: 0
			});
			App.closeToast();
		},
		selectRadio:function(e){
			var target = e.target;
			if(!$(target).hasClass("checked")){
				target.classList.add("checked");
				target.previousSibling.classList.add("innerCir");
				if(target.id == "radio_address"){
					this.initSwiper(e);
				}else if(target.id == "radio_error"){
					this.type = 1;
					$("#addressDetail").css("height","5rem");
					this.radioAddress.classList.remove("checked");
					this.radioAddress.previousSibling.classList.remove("innerCir");
					this.addressContnet.style.display = "none";
					this.errorContent.style.display = "block";
					this.select.hide();
					this.destoryScroll();
				}
			}

			e.preventDefault();
			return false;
		},
		initSwiper:function(e){
			var inputVal = $("#select_address").val();
			$("#addressDetail").css("height","9rem");
			this.radioAddress.classList.add("checked");
			this.radioAddress.previousSibling.classList.add("innerCir");
			this.type = 0;
			this.radioError.classList.remove("checked");
			this.radioError.previousSibling.classList.remove("innerCir");
			this.errorContent.style.display = "none";
			this.addressContnet.style.display = "inline-block";
			this.select.show();
			
			if(this.provinceScroll && this.cityScroll && this.areaScroll){
				this.provinceScroll.update();
				this.cityScroll.update();
				this.areaScroll.update();
			}else{
				this.initProvinceScroll();
				this.initCityScroll();
				this.initAreaScroll();
			}
			
			e.preventDefault();
		},
		destoryScroll:function(){
			//销毁swipe
			pScroll = this.provinceScroll = null;
			cScroll = this.cityScroll = null;
			aScroll = this.areaScroll = null;
		},
		render: function() {
			this.data = this.model.toJSON();
			this.$el.html(this.template(this.data));
			this.radioAddress = document.getElementById("radio_address");
			this.radioError = document.getElementById("radio_error");
			this.errorContent = document.getElementById("error_content");
			this.addressContnet = document.getElementById("address_content");
			this.select = $(".select");
			this.selectAddress = $("#select_address");
			this.province = "";
			this.city = "";
			this.area = "";
			new view_Province;
			new view_City;
			new view_Aera;
		},
		initProvinceScroll:function(){
			var _this = this;
			this.provinceScroll = new Swiper('#provinceSwip', {
				direction: 'vertical',
	            slidesPerView : 5,
				centeredSlides : true,
	            initialSlide:0,
	            onSlideChangeEnd:function(swiper){
	            	var val = swiper.slides[swiper.activeIndex].innerText;
			    	_this.changeProvinceList(val);
			    	_this.setProvince(val);
	            }
			});
		    pScroll = this.provinceScroll;
		},
		filterAddress:function(str){
			if(str !== "" && str !== "请选择" && str !== "其他"){
				return str;
			}else{
				//App.showDia("alertDia animated bounceIn", "请选择具体地址！");
				return "";
			}
		},
		setProvince:function(province){
			this.province = this.filterAddress(province);
		},
		setCity:function(city){
			this.city = this.filterAddress(city);
		},
		setArea:function(area){
			this.area = this.filterAddress(area);
		},
		saveScroll:function(e){
			var val = this.province+this.city+this.area;
			var isNull = function(val){
				return (val == "" || val == "请选择") ? true : false;
			};
			
			if(isNull(this.city)){
				App.showDia("alertDia animated bounceIn", "请选择城市！");
				return false;
			}
			
			if(isNull(this.area)){
				App.showDia("alertDia animated bounceIn", "请选择地区！");
				return false;
			}
			
			this.selectAddress.val(val);
			this.select.hide();
			e.preventDefault();
			return false;
		},
		changeProvinceList:function(val){
			var name = val;
			var cityArr = _.where(SiteJson,{'name':name})[0].sub;
			var citys = _.where(cityArr,{type:0});
			cityData = citys;
			if(name == "请选择"){
				list_city.reset(city_arr);
				list_aera.reset(city_arr[0].sub);
			}else{
				list_city.reset(citys);
				list_aera.reset(citys[0].sub);
			}
		},
		initCityScroll:function(){
			var _this = this;
			this.cityScroll = new Swiper('#citySwip', {
				direction: 'vertical',
	            slidesPerView : 5,
				centeredSlides : true,
	            initialSlide:0,
	            onSlideChangeEnd:function(swiper){
	            	var val = swiper.slides[swiper.activeIndex].innerText;
			    	_this.changeCityList(val);
			    	_this.setCity(val);
	            }
			});
		    cScroll = this.cityScroll;
		},
		changeCityList:function(val){
			var name = val;
			var cityArr = [];
			if(cityData != null){
				if(cityData.length >0){
					cityArr = _.where(cityData,{'name':name})[0].sub;
				}
			}else{
				cityArr = _.where(city_arr,{'name':name})[0].sub;
			}
			list_aera.reset(cityArr);
		},
		initAreaScroll:function(){
			var _this = this;
			this.areaScroll = new Swiper('#areaSwip', {
				direction: 'vertical',
	            slidesPerView : 5,
				centeredSlides : true,
	            initialSlide:0,
	            onSlideChangeEnd:function(swiper){
	            	var val = swiper.slides[swiper.activeIndex].innerText;
	            	_this.setArea(val);
	            }
			});
		    aScroll = this.areaScroll;
		},
		changeAreaList:function(val){
			var name = val;
			var cityArr = _.where(SiteJson,{'name':name})[0].sub;
			var citys = _.where(cityArr,{type:0});
			cityData = citys;
			if(name == "请选择"){
				list_city.reset(city_arr);
				list_aera.reset(city_arr[0].sub);
			}else{
				list_city.reset(citys);
				list_aera.reset(citys[0].sub);
			}
		},
		mask: function(e) {
			this.select.hide();
			this.destoryScroll();
			e.preventDefault();
			return false;
		},
		serviceBtn: function() {
			var userName = $("#userName").val(),
				phone = $("#PhoneNum").val(),
				error_content = $("#error_content").val(),
				address = $("#address_input").val();
			this.data = {
				'name':userName,
				'phone':phone,
				'address':address,
				'problem': error_content,
			};
			var isInputName = (this.data.name !== ""),
				isInputPhone = (this.data.phone !== ""),
				isInputAddress = (this.data.address !== ""),
				isInputProblem = (this.data.problem !== "");
			
			var isInputAddress = (this.type == 0 && this.data.name != "" && this.data.phone != "")
			if (isInputName && isInputPhone && ((this.type == 0 && isInputAddress) || (this.type == 1 && isInputProblem))) {
				this.model.set({
					code: 0
				});
				
				//验证姓名20个字符
				if(this.data.name.trim().length >20){
					App.showDia("alertDia animated bounceIn", "姓名必须在20个字符以内！");
					return false;
				}
				
				//验证手机号码
				if(!(/^1\d{10}$/g).test(this.data.phone)){
					App.showDia("alertDia animated bounceIn", "请输入11位手机号码！");
					return false;
				}
				
				$.ajax({
					url: App.BaseUrl+"api/applyMaintenance",
					async: true,
					type: "post",
					data: {
						"type":this.type,
						"clientId":App.getClientId(),
						"name": this.data.name,
						"mobile": this.data.phone,
						"address": this.data.address || "无",
						"province":this.province || "无",
						"city":this.city || "无",
						"district":this.area || "无",
						"remark": this.data.problem || "无"
					},
					success: function(data) {
						if(data.responseCode == "200"){
							$(".mask").removeClass("hide").find(".mask_tip").addClass("active");
							App.showDia("alertDia animated bounceIn", "您的申请已提交！");
							wx.closeWindow();
						}else{
							App.showDia("alertDia animated bounceIn", "您的申请提交失败！");
						}
					}
				})
			}else{
				App.showDia("alertDia animated bounceIn", "请输入完整信息！");
			}
		}
	});

	var controller = function() {
		var Model = new serviceModel();
		var View = new serviceView({
			model: Model
		});

		controller.onRouteChange = function() {
			View.undelegateEvents();
		}
	};

	return {
		controller: controller
	}
});