var createReactClass = require('create-react-class');

MenuItemType = createReactClass({
	mixins: [ReactMeteorData],
	getMeteorData() {
		return {
			templateRegister: PanoplyCMSCollections.RegisteredPackages.findOne({name:'template'}),
			results: PanoplyCMSCollections.MenuItems.find().fetch(),
			menus: PanoplyCMSCollections.Menus.find({}).fetch()
		};
	},
	getInitialState(){
		let menu = {}
		_.each(this.props.value, v => {
			menu[v] = true
		})
		return { menu }
	},
	componentDidMount: function(){
		$('.collapsed').click('panel-collapse collapse in',function(){
			$(this).parent().find(".fa fa-plus-circle").removeClass("fa fa-plus-circle").addClass("fa fa-minus-circle");
		}).click('panel-collapse collapse', function(){
			$(this).parent().find(".fa fa-minus-circle").removeClass("fa fa-minus-circle").addClass("fa fa-plus-circle");
		});
	},
	listOfMenu(){
		var elements = this.data.results;
		var menu = new Array();

		function getElements(parent_id){
			if(parent_id){
				return getChild(parent_id);
			} else {
				var element = new Array();
				elements.forEach(function (elem1) {
					var child = getChild(elem1._id);
					if(elem1.parentId==''){
						element.push({ _id: elem1._id, title: elem1.title, mainParentId:elem1.mainParentId, alias: elem1.alias, desc:elem1.desc, child: child });
					}
				});
				return element;
			}
		}

		function getChild(parent_id){
			var child = new Array();
			elements.forEach(function (elem2) {
				if(elem2.parentId){
					if(parent_id== elem2.parentId){
						child.push({ _id: elem2._id, title: elem2.title, mainParentId:elem2.mainParentId, alias: elem2.alias, desc:elem2.desc, child: getElements(elem2._id) });
					}
				}
			});
			return child;
		}
		// console.log(getElements(),'getElements()')
		return getElements();
	},
	render:function(){
		return (
			<div className="form-group">
				<label htmlFor="lastname" className="col-md-2 control-label">Menu Items</label>
				<div className="col-sm-6">
					<div>
						{this.renderMenuList(this.listOfMenu())}
					</div>
				</div>
			</div>
		)
	},
	menulistCheck(i){
		console.log(" ---==== >", i)
		if($("#menus"+i).hasClass('collapsed')){
			$("#menus-icon"+i).removeClass('fa fa-plus-circle').addClass('fa fa-minus-circle')
		}else{
			$("#menus-icon"+i).removeClass('fa fa-minus-circle').addClass('fa fa-plus-circle')
		}
	},
	renderMenuList: function(menulist){
		// console.log("menulist ====> ",menulist)
		let menus = _.groupBy(menulist, function(m){ return m.mainParentId; })
		let menuKeys = _.keys(menus);
		return menuKeys.map((m,i) => {
			let k = Math.random();
			mainmenu = _.find(this.data.menus, (mm) => { return mm._id == m })
			// console.log("===> ",mainmenu)
			return (
				<div key={k} className="panel-group">
	       	<div className="panel panel-default">
	         	<div className="panel-heading menuitem-heading">
	            <h4 className="panel-title">
		            <a data-toggle="collapse" href={"#collapse"+i} id={"menus"+i} className="collapsed">
	               	<span className="expand-icon">
	               		<i className={$("#menus"+i).hasClass('collapsed')?"fa fa-plus-circle":"fa fa-minus-circle"} aria-hidden="true"></i>
	               	</span>
	             	</a>  
      					&nbsp;&nbsp;&nbsp;{mainmenu && mainmenu.title ? mainmenu.title :''}
	            </h4>
	         	</div>
	         	<div id={"collapse"+i} className="panel-collapse collapse in menuitemlist">
           		{this.printList(menus[m], 0)}
	         	</div>
			     	</div>
			    </div>
			)
		})
	},
	
	handleClick(id){
		obj = this.state.menu
		obj[id] = obj[id]?false:true;
		this.setState({ menu: obj})
	},
	printList(items, padding){
		if(padding > 0) padding = 0;
		return <ul style={{listStyle:"none", paddingLeft: padding}}>
			{
				items.map(i => {
					return (
						<li key={i._id}>
							<input type="checkbox" value={i._id} defaultChecked={this.state.menu[i._id]} onClick={()=>{this.handleClick(i._id)}} name="menucheck" className="allPage" /> {i.title}
							{i.child.length?this.printList(i.child, padding+0):''}
						</li>
					)
				})
			}
		</ul>
	}
})


export default MenuItemType;