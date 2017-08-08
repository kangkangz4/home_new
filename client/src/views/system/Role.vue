<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="listRole">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="roles" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="角色名称" width="595" sortable>
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

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="部门名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="editForm.order" :min="0" :max="99"></el-input-number>
				</el-form-item>
				<el-form-item label="人员列表">
					<el-transfer
				    filterable
				    :titles="['可选人员', '已选人员']"
				    filter-placeholder="请输入用户拼音"
				    :filter-method="filterMethod"
				    v-model="editForm.accounts"
				    :props="{
					      key: '_id',
					      label: 'name'
					    }"
				    :data="allAccounts">
				  </el-transfer>
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
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="addForm.order" :min="0" :max="99"></el-input-number>
				</el-form-item>
				<el-form-item label="人员列表">
					<el-transfer
				    filterable
				    :titles="['可选人员', '已选人员']"
				    filter-placeholder="请输入用户拼音"
					:filter-method="filterMethod"
				    v-model="addForm.accounts"
				    :props="{
					      key: '_id',
					      label: 'name'
					    }"
				    :data="allAccounts">
				  </el-transfer>
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
import { listAccount, listRole, addRole, editRole, removeRole } from '../../api/api';


export default {
	data(){
		return {
			filters:{
				name: ''
			},
			filterMethod(query, item) {
          		return item.pinyin.indexOf(query) > -1;
        	},
			allAccounts:[],

			listLoading:false,
			roles:[],

			addFormVisible:false,
			addLoading:false,
			addFormRules:{
				name:[
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				]
			},
			addForm:{},

			editFormVisible:false,
			editLoading:false,
			editFormRules:{
				name:[
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				]
			},
			editForm:{},
		}
	},
	methods:{
		listAccount(){
			listAccount().then((res)=>{
				this.allAccounts = res.result;
			}, (error) =>{
				console.log(error);
			})
		},
		listRole(){
			this.listLoading = true;
			const para = {
				name: this.filters.name
			};
			listRole(para).then((res)=>{
				this.listLoading = false;
				this.roles = res.result;
			}, (error)=>{
				this.listLoading = false;
				this.$message.error(error);
			})
		},
		handleEdit(index, row){
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		handleDel(index, row){
			this.$confirm('确认删除该记录吗？', '提示', {}).then(()=>{
				removeRole(row._id).then((res)=>{
					this.$message.success(res.message);
					this.listRole();
				}, (error)=>{
					this.$message.error(error);
				})
			})
		},
		handleAdd(){
			this.addFormVisible = true;
			this.addForm = {
				name: '',
				order: 1,
				accounts: []
			}
		},
		addSubmit(){
			this.$refs.addForm.validate((valid)=>{
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.addLoading = true;
				const para = Object.assign({}, this.addForm);
				addRole(para).then((res)=>{
					this.addLoading = false;
					this.listRole();
					this.$message.success(res.message);
					this.addFormVisible = false;
				}, (error)=>{
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
				const para = Object.assign({}, this.editForm);
				editRole(para).then((res)=>{
					this.editLoading = false;
					this.listRole();
					this.$message.success(res.message);
					this.editFormVisible = false;
				}, (error)=>{
					this.editLoading = false;
					this.$message.error(error);
				})
			})
		}
	},
	mounted(){
		this.listRole();
		this.listAccount();
	}
}
</script>