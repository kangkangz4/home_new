<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="权限名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="listPermission">查询</el-button>
				</el-form-item>
				<el-form-item v-show="canAdd">
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="permissions" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="权限名称" width="595" sortable>
			</el-table-column>
			<el-table-column prop="order" label="排序" width="120" sortable>
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
				<el-form-item label="权限名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="role">
					<el-select v-model="editForm.role" placeholder="请选择角色">
					    <el-option
					      v-for="item in roles"
					      :key="item._id"
					      :label="item.name"
					      :value="item._id">
					    </el-option>
				  	</el-select>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="editForm.order" :min="0" :max="99"></el-input-number>
				</el-form-item>
				<el-form-item label="操作">
					<div v-for="(menu, index) in editMenus" style="border-top-style: solid; border-top-width: 1px">
						<div style="font-weight: bold; float:left; width:100px;">{{menu.name}}</div>
						<el-checkbox v-model="menu.allchecked" @change="handleCheckAllChange(menu)">全选</el-checkbox>
						<div v-for="child in menu.children">
							<div style="float: left; width:100px;">{{child.name}}</div>
							<el-checkbox-group v-model="child.permissions">
							    <el-checkbox label="查看"></el-checkbox>
							    <el-checkbox label="创建"></el-checkbox>
							    <el-checkbox label="编辑"></el-checkbox>
							    <el-checkbox label="删除"></el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
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
				<el-form-item label="权限名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="role">
					<el-select v-model="addForm.role" placeholder="请选择角色">
					    <el-option
					      v-for="item in roles"
					      :key="item._id"
					      :label="item.name"
					      :value="item._id">
					    </el-option>
				  	</el-select>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="addForm.order" :min="0" :max="99"></el-input-number>
				</el-form-item>
				<el-form-item label="操作">
					<div v-for="(menu, index) in addMenus" style="border-top-style: solid; border-top-width: 1px">
						<div style="font-weight: bold; float:left; width:100px;">{{menu.name}}</div>
						<el-checkbox v-model="menu.allchecked" @change="handleCheckAllChange(menu)">全选</el-checkbox>
						<div v-for="child in menu.children">
							<div style="float: left; width:100px;">{{child.name}}</div>
							<el-checkbox-group v-model="child.permissions">
							    <el-checkbox label="查看"></el-checkbox>
							    <el-checkbox label="创建"></el-checkbox>
							    <el-checkbox label="编辑"></el-checkbox>
							    <el-checkbox label="删除"></el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
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
import { getMenus,listRole, listPermission, addPermission, editPermission, removePermission } from '../../api/api'
import { mapGetters } from 'vuex'
import util from '../../common/js/util'

export default {
	computed: {  
    	...mapGetters(['account'])
	},
	data(){
		return {
			filters:{
				name: ''
			},
			canAdd:false,
			canEdit:false,
			canDelete:false,
			listLoading:false,
			permissions: [],
			operations: [],
			roles: [],
			sortMenus:[],

			addFormVisible:false,
			addFormRules:{
				name:[
					{ required: true, message: '请输入权限名称', trigger: 'blur' }
				],
				role: [
		            { required: true, message: '请选择角色', trigger: 'change' }
		        ]
			},
			addLoading:false,
			addForm:{},
			addMenus:[],

			editFormVisible:false,
			editFormRules:{
				name:[
					{ required: true, message: '请输入权限名称', trigger: 'blur' }
				],
				role: [
		            { required: true, message: '请选择角色', trigger: 'change' }
		        ]
			},
			editLoading: false,
			editForm: {},
			editMenus:[],

		}
	},
	methods:{
		setPermission(){
			const permissions = this.account.permissions;
			this.canAdd = util.hasPermission(permissions, 'permission', '创建');
			this.canEdit = util.hasPermission(permissions, 'permission', '编辑');
			this.canDelete = util.hasPermission(permissions, 'permission', '删除');
		},
		listRole(){
			const para = {
				name: ''
			}
			listRole(para).then((res)=>{
				this.roles = res.result;
			}, (error)=>{
				this.$message.error(error);
			})
		},
		//获取权限
		getPermissions(menus){
			let permissions = [];
			_.each(menus, (menu)=>{
				_.each(menu.children, (child)=>{
					if(child.permissions.length > 0){
						const dict = {
							name:child.shortname,
							permissions:child.permissions
						};
						permissions.push(dict);
					}
				})
			})
			return permissions;
		},
		getAllChecked(menu){
			let allchecked = true;
			_.each(menu.children, (child)=>{
				//没有全部选中
				if(child.permissions.length !== 4){
					allchecked = false;
				}
			})
			return allchecked;
		},
		//编辑操作
		editPermission(menus, permissions){
			const menus_ = _.cloneDeep(menus);
			_.each(menus_, (menu)=>{
				_.each(menu.children, (child)=>{
					const object = _.find(permissions, {name:child.shortname})
					if(object){
						child.permissions = object.permissions;
					}else{
						child.permissions = [];
					}
				})
				menu.allchecked = this.getAllChecked(menu);
			})
			this.editMenus = menus_;
		},
		//重置每个菜单中的选项
		resetMenus(menus){
			const menus_ = _.cloneDeep(menus)
			_.each(menus_, (menu)=>{
				menu.allchecked = false;
				_.each(menu.children, (item)=>{
					item.permissions = [];
				})
			})
			this.addMenus = menus_;
		},
		listMenu(){
			getMenus().then((res)=>{
				const sortMenus_ = util.sortTree(res.result);
				this.sortMenus = sortMenus_;
				this.resetMenus(sortMenus_);
			},(error)=>{
				this.$message.error(error);
			})
		},
		listPermission(){
			this.listLoading = true;
			listPermission().then((res)=>{
				this.listLoading = false;
				this.permissions = res.result;
			},(error)=>{
				this.$message.error(error);
			})
		},
		handleEdit(index, row){
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
			this.editPermission(this.sortMenus, row.permissions);
		},
		handleDel(index, row){
			this.$confirm('确认删除该记录吗？', '提示', {}).then(()=>{
				removePermission(row._id).then((res)=>{
					this.$message.success(res.message);
					this.listPermission();
				}, (error)=>{
					this.$message.error(error);
				})
			})
		},
		handleAdd(){
			this.resetMenus(this.addMenus);
			this.addFormVisible = true;
			this.addForm = {
				name: '',
				order: 1,
				role: '',
				permissions: []
			}
		},
		addSubmit(){
			this.$refs.addForm.validate((valid)=>{
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.addLoading = true;
				let para = Object.assign(this.addForm);
				para.permissions = this.getPermissions(this.addMenus);
				addPermission(para).then((res)=>{
					this.addLoading = false;
					this.listPermission();
					this.$message.success(res.message);
					this.addFormVisible = false;
				},(error)=>{
					this.addLoading = false;
					this.$message.error(error);
				})
			})
		},
		editSubmit(){
			this.$refs.editForm.validate((valid)=>{
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.editLoading = true;
				let para = Object.assign({}, this.editForm);
				para.permissions = this.getPermissions(this.editMenus);
				editPermission(para).then((res)=>{
					this.editLoading = false;
					this.listPermission();
					this.$message.success(res.message);
					this.editFormVisible = false;
				}, (error)=>{
					this.editLoading = false;
					this.$message.error(error);
				})
			})
		},
		//全选按钮
		handleCheckAllChange(menu){
			_.each(menu.children, (child)=>{
				if(menu.allchecked){
					child.permissions = ['查看','创建','编辑','删除'];
				}else{
					child.permissions = [];
				}
			})
		}
	},
	mounted(){
		this.setPermission();
		this.listMenu();
		this.listRole();
		this.listPermission();
	}
}
</script>