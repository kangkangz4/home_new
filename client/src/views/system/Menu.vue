<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-show="canAdd">
			<el-form :inline="true">
		    </el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="menus" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="node" label="节点" width="80">
			</el-table-column>
			<el-table-column prop="name" label="菜单名称" width="120">
			</el-table-column>
			<el-table-column prop="path" label="路径" width="120">
			</el-table-column>
			<el-table-column prop="componentUrl" label="组件路径" width="260">
			</el-table-column>
			<el-table-column label="图标" width="100">
				<template scope="scope">
					<i :class="scope.row.icon"></i>
				</template>
			</el-table-column>
			<el-table-column prop="order" label="排序" width="90">
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-show="canEdit">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" v-show="canDelete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="菜单名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="英文简称" prop="shortname">
					<el-input v-model="editForm.shortname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路径" prop="path">
					<el-input v-model="editForm.path"></el-input>
				</el-form-item>
				<el-form-item label="组件路径" prop="componentUrl">
					<el-input v-model="editForm.componentUrl" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="图标">
					<el-input v-model="editForm.icon" style="width:90%"></el-input>
					<i :class="editForm.icon" style="float:right;width=30px;marign-top:10px;"></i>
				</el-form-item>
				<el-form-item label="父目录">
					 <el-select v-model="editForm.parent" placeholder="请选择父目录">
				    <el-option
				      v-for="item in selectMenus"
				      :key="item._id"
				      :label="item.name"
				      :value="item._id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="editForm.order" :min="0" :max="99"></el-input-number>
				</el-form-item>
				<el-form-item label="是否隐藏">
					<el-switch v-model="editForm.isHidden" on-text="是" off-text="否"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="菜单名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="英文简称" prop="shortname">
					<el-input v-model="addForm.shortname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路径" prop="path">
					<el-input v-model="addForm.path"></el-input>
				</el-form-item>
				<el-form-item label="组件路径" prop="componentUrl">
					<el-input v-model="addForm.componentUrl" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="图标">
					<el-input v-model="addForm.icon" style="width:90%"></el-input>
					<i :class="addForm.icon" style="float:right;width=30px;marign-top:10px;"></i>
				</el-form-item>
				<el-form-item label="父目录">
					 <el-select v-model="addForm.parent" placeholder="请选择父目录">
				    <el-option
				      v-for="item in selectMenus"
				      :key="item._id"
				      :label="item.name"
				      :value="item._id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="addForm.order" :min="0" :max="99"></el-input-number>
				</el-form-item>
				<el-form-item label="是否隐藏">
					<el-switch v-model="addForm.isHidden" on-text="是" off-text="否"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
import { mapGetters, mapActions } from 'vuex'
import { addMenu, editMenu, removeMenu, getMenus } from '../../api/api'

export default {
	data(){
		return {
			canAdd:false,
			canEdit:false,
			canDelete:false,

			menus:[],
			selectMenus: [],
			listLoading: false,

			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入菜单名称', trigger: 'blur' }
				],
				shortname: [
					{ required: true, message: '请输入英文简称', trigger: 'blur' }
				],
				path: [
					{ required: true, message: '请输入路径', trigger: 'blur' }
				],
				componentUrl: [
					{ required: true, message: '请输入组件路径', trigger: 'blur' }
				]
			},
			//编辑界面数据
			editForm: {},

			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				name: [
					{ required: true, message: '请输入菜单名称', trigger: 'blur' }
				],
				shortname: [
					{ required: true, message: '请输入英文简称', trigger: 'blur' }
				],
				path: [
					{ required: true, message: '请输入路径', trigger: 'blur' }
				],
				componentUrl: [
					{ required: true, message: '请输入组件路径', trigger: 'blur' }
				]
			},
			//新增界面数据
			addForm: {}

		}
	},
	computed: {  
    	...mapGetters([ 'menuitems', 'account'])
  	},
	methods: {
		...mapActions([  
        	'setMenu',
        	'loadRoutes'
     	]),
     	//权限
     	setPermission(){
     		const permissions = this.account.permissions;
     		this.canAdd = util.hasPermission(permissions, 'menu', '创建');
     		this.canEdit = util.hasPermission(permissions, 'menu', '编辑');
     		this.canDelete = util.hasPermission(permissions, 'menu', '删除');
     	},
		//获取父级目录
		getSelectMenus(){
			const menus = _.cloneDeep(this.menuitems);
			menus.splice(0, 0, {_id:'',name:'----'});
			return menus;
		},
		getMenus(){
			getMenus().then(res => {
				this.setMenu(res.result);
				this.menus = this.getMenusList();
				this.selectMenus = this.getSelectMenus();
			})
		},
		getMenusList(){
			//增加节点字段
			const menus = _.cloneDeep(this.menuitems);
			let menus_ = [];
			_.each(menus, (m)=>{
				m.node = '---';
				menus_.push(m);
				_.each(m.children, (n)=>{
					n.node = '|--';
					menus_.push(n);
				})
			})
			return menus_;
		},
		//显示新增界面
		handleAdd(){
			this.addFormVisible = true;
			this.addForm = {
				name: '',
				shortname: '',
				path: '/',
				componentUrl: '',
				icon: '',
				parent: '',
				order: 1,
				isHidden: false
			}
		},
		//显示编辑界面
		handleEdit(index, row){
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
			if(!this.editForm.parent){
				this.editForm.parent = '';
			}
		},
		//处理删除
		handleDel(index, row){
			this.$confirm('确认要删除该菜单？', '提示', { type: 'warning' })
				.then(()=>{
					this.listLoading = true; 
					removeMenu(row._id).then((res)=>{
						this.listLoading = false;
						this.$message.success(res.message);
						this.getMenus();
					})
				})
		},
		//新增
		addSubmit(){
			this.$refs.addForm.validate((valid) =>{
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.addLoading = true;
				let para = Object.assign({}, this.addForm);
				addMenu(para).then((res) => {
					this.addLoading = false;
					this.$message.success(res.message);
		            this.$refs['addForm'].resetFields();
		            this.addFormVisible = false;
		            this.getMenus();
				})
			})
		},
		//编辑
		editSubmit(){
			this.$refs.editForm.validate((valid) =>{
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.editLoading = true;
				let para = Object.assign({}, this.editForm);
				editMenu(para).then(res => {
					this.editLoading = false;
					this.$message.success(res.message);
					this.$refs['editForm'].resetFields();
					this.editFormVisible = false;
					this.getMenus();
				})
			})
		},
	},
	mounted(){
		this.setPermission();
		this.menus = this.getMenusList();
		this.selectMenus = this.getSelectMenus();
	}
}
</script>