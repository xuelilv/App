define(['text!../html/userProfile.html','text!../json/site.json'], function(html,SiteJson) {
	var SiteJson = JSON.parse(SiteJson);
	console.log(SiteJson);
	var cityData = null;
	var city_arr = _.where(SiteJson,{type:0});
	var area_arr = _.where(city_arr,{'name':'北京市'})[0].sub;
	var userProfileModel = Backbone.Model.extend({});
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
			this.$el.html("<option>"+this.model.get("name")+"<\/option>");
			return this;
		}
	});
	var view_Aera = Backbone.View.extend({
		el:"#s3",
		els:"",
		initialize:function(){
			this.listenTo(list_aera, "reset", this.addAll);
			list_aera.reset(area_arr);
			
		},
		render:function(){
			this.$el.html(this.els);
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
		el:"#s2",
		els:"",
		events:{
			"change":"changeOp"
		},
		initialize:function(){
			this.listenTo(list_city, "reset", this.addAll);
			list_city.reset(city_arr);
		},
		render:function(){
			this.$el.html(this.els);
		},
		changeOp:function(e){
			console.log(e);
			var name = e.target.value;

			if(name == ""){
				name = "请选择";
			}
			var cityArr = [];
			if(cityData != null){
				if(cityData.length >0){
					cityArr = _.where(cityData,{'name':name})[0].sub;
				}
			}else{
				cityArr = _.where(city_arr,{'name':name})[0].sub;
			}
			list_aera.reset(cityArr);
			e.preventDefault();
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
		el:"#s1",
		els:"",
		events:{
			"change":"changeOp"
		},
		initialize:function(){
			this.listenTo(list_province, "reset", this.addAll);
			list_province.reset(_.where(SiteJson,{type:1}));
			
		},
		render:function(){
			this.$el.html(this.els);
		},
		changeOp:function(e){
			var name = e.target.value.trim();
			if(name == ""){
				name = "请选择";
			}
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
			e.preventDefault();
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
	
	
	var userProfileView = Backbone.View.extend({
		el: "#views",
		sex: 1,
		familySize: null,
		template: _.template(html),
		events: {
			"touchstart .save_btn a": "save_data",
			"touchstart .less": "less",
			"touchstart .add_ed": "add",
			"blur .name": "checkName",
			"blur .phone_num": "phoneBlur",
			"blur .emailType": "emailBlur",
			"blur textarea": "textBlur",
			"click .check_sex a": "checkSex"
		},

		initialize: function() {
			var userData = JSON.parse(window.localStorage.getItem("userData"));

			this.listenTo(this.model, "change", this.render);
			this.model.set({
				address: userData.address,
				mobile: userData.mobile,
				email: userData.email,
				familySize: userData.familySize,
				name: userData.name,
				sex: userData.sex,
				district:userData.district,
				province:userData.province,
				city:userData.city
			});
		},

		render: function() {
			var data = this.model.toJSON();
			this.modelData = data;
			this.$el.html(this.template(data));
			this.sex = data.sex;
			this.familySize = data.familySize;
			new view_Province;
			new view_City;
			new view_Aera;
			this.initSelect("s1","province");
			this.initSelect("s2","city");
			this.initSelect("s3","district");
		},
		initSelect:function(id,key){
			var s = $("#"+id);
			var firstEl = s.find("option").eq(0);
			var val = this.modelData[key] == "无" ? "请选择" : this.modelData[key];
			
			if(id == "s1"){
				var cityArr = _.where(SiteJson,{'name':val})[0].sub;
				var citys = _.where(cityArr,{type:0});
				if(val == "请选择"){
					list_city.reset(city_arr);
					list_aera.reset(city_arr[0].sub);
				}else{
					list_city.reset(citys);
					list_aera.reset(citys[0].sub);
				}
			}
			
			s.find("option").each(function(index){
				if($(this).val() == val){
					$(this).attr("selected","selected")
				}
			});
		},
		less: function(e) {
			var val = parseInt($(".people_num").val());
			if (val > 1) {
				$(".people_num").val(val -= 1);
				this.familySize = val;
			}
			e.preventDefault();
		},

		add: function(e) {
			var val = parseInt($(".people_num").val());
			$(".people_num").val(val += 1);
			this.familySize = val;
			e.preventDefault();
		},

		checkName: function(ev) {
			var nameVal = $(".name").val(),
				nameError = $(".nameError");
			
			var re = /[@\/'\\"#$%&\^*]+/gi;
			var nameReg = re.test(nameVal);
			
			//判断不能为空
			if(nameVal == ""){
				nameError.html("姓名不能为空").removeClass("hide");
				return false;
			}
			
			//判断字符长度
			if(nameVal !== "" && nameVal.trim().length > 20){
				nameError.html("必须在20个字符以内").removeClass("hide");
				return false;
			}
			console.log(re.test(nameVal.trim()),nameVal.trim());
			if(nameVal !== "" && re.test(nameVal.trim())){
				nameError.html("不能包含特殊字符").removeClass("hide");
				return false;
			}
			
			nameError.addClass("hide");
			return true;
		},
		phoneBlur: function() {
			var phoneNum = $(".phone_num").val();
			var telReg = !!phoneNum.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);

			telReg ? $(".phoneError").addClass("hide") : $(".phoneError").removeClass("hide");
			return telReg;
		},

		emailBlur: function() {
			var emailNum = $(".emailType").val();
			if (emailNum.indexOf("@") > 0) {
				var em_qq_Reg = !!emailNum.match(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/);
			} else {
				var em_qq_Reg = !!emailNum.match(/[1-9][0-9]{4,14}/);
			}
			em_qq_Reg ? $(".emailError").addClass("hide") : $(".emailError").removeClass("hide");
			return em_qq_Reg;
		},

		checkSex: function(ev) {
			if (ev.target.className == "man") {
				$(".check_sex").find("i:nth-of-type(1)").addClass("on").siblings().removeClass("on");
				this.sex = 1;
			} else if (ev.target.className == "woman") {
				$(".check_sex").find("i:nth-of-type(2)").addClass("on").siblings().removeClass("on");
				this.sex = 2;
			}
		},

		textBlur: function() {
			var text = $(".textBlur").val();
			var balse = null;

			text != "" ? balse = true : balse = false;
			balse ? $(".addressError").addClass("hide") : $(".addressError").removeClass("hide");
			return balse;
		},

		save_data: function(e) {
			e.preventDefault();
			var userData = JSON.parse(window.localStorage.getItem("userData"));
			var _this = this;
			var s1 = $("#s1").val(),s2 = $("#s2").val(),s3 = $("#s3").val();
			var getAddress = function(){
				var filter = function(str) {
					return (str == '请选择' ? "无" : str);
				};
				return {
					'province':filter(s1).trim(),
					'city':filter(s2).trim(),
					'district':filter(s3).trim()
				};
				
			};
			var isNull = function(val){
				return (val == "" || val == "请选择") ? true : false;
			};

			if(isNull(s2)){
				App.showDia("alertDia animated bounceIn", "请选择城市！");
				return false;
			}
			
			if(isNull(s3)){
				App.showDia("alertDia animated bounceIn", "请选择地区！");
				return false;
			}
			
			if (this.checkName() && this.phoneBlur() && this.emailBlur() && this.sex != null && this.textBlur()) {
				var jsonData = {
					"clientId": userData.id,
					"name": $(".name").val().replace(/\s/g,""),
					"sex": this.sex,
					"mobile": $(".phone_num").val(),
					"email": $(".emailType").val(),
					"address": $("#detailAddress").val(),
					"province":getAddress().province,
					"city":getAddress().city,
					"district":getAddress().district,
					"familySize": this.familySize
				};
				//console.log(jsonData)
				$.ajax({
					url: App.BaseUrl + "api/client/saveClient",
					async: true,
					type: "post",
					data: jsonData,
					success: function(data) {
						if (data.responseCode == 200) {
							Backbone.history.navigate('personal', {
								trigger: true,
								replace: true
							});
						}
					}
				});
			}
		}
	});

	var controller = function() {
		var Model = new userProfileModel();
		var View = new userProfileView({
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