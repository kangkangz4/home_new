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
				<el-form-item>
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
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名称" prop="name">
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
					<div v-for="(operation, index) in operations" style="border-top-style: solid; border-top-width: 1px">
						<div style="float: left; width:150px;">{{operation.name}}</div>
						<el-checkbox-group v-model="addForm.permissions[index]">
							<el-checkbox v-for="o in operation.op" :label="o.label" :key="o.key"></el-checkbox>
						</el-checkbox-group>
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

export default {
	data(){
		return {
			filters:{
				name: ''
			},
			listLoading:false,
			permissions: [],
			operations: [],
			roles: [],

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
			addForm:{}

		}
	},
	methods:{
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
		listMenu(){
			getMenus().then((res)=>{
				const result = res.result;
				//过滤出二级子目录
				const menus_ = _.filter(result, (m)=>{
					return m.parent.length > 0
				})
				let opers = [];
				_.each(menus_, (m)=>{
					const op = {
						name:m.name, 
						op:[
							{label:'查看',key:m.shortname+'_view'},
							{label:'创建',key:m.shortname+'_create'},
							{label:'更新',key:m.shortname+'_update'},
							{label:'删除',key:m.shortname+'_delete'},
						]
					}
					opers.push(op);
				})
				this.operations = opers;
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

		},
		handleDel(index, row){

		},
		handleAdd(){
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
			})
		}
	},
	mounted(){
		this.listMenu();
		this.listRole();
		this.listPermission();
	}
}
</script>