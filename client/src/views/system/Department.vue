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
		<el-table :data="departList" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="node" label="节点" width="100">
			</el-table-column>
			<el-table-column prop="name" label="部门名称" width="405">
			</el-table-column>
			<el-table-column prop="accounts.length" label="人员数量" width="150">
			</el-table-column>
			<el-table-column prop="order" label="排序" width="120">
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
				<el-form-item label="部门名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="父目录">
					 <el-select v-model="editForm.parent" placeholder="请选择父目录">
				    <el-option
				      v-for="item in selectDeparts"
				      :key="item._id"
				      :label="item.name"
				      :value="item._id">
				    </el-option>
				  </el-select>
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
				<el-form-item label="部门名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="父目录">
					<el-select v-model="addForm.parent" placeholder="请选择父目录">
					    <el-option
					      v-for="item in selectDeparts"
					      :key="item._id"
					      :label="item.name"
					      :value="item._id">
					    </el-option>
				  	</el-select>
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
import { mapGetters } from 'vuex'
import { listDepartment, addDepartment, editDepartment, removeDepartment, listAccount } from '../../api/api'
import util from '../../common/js/util'

export default {
	computed: {  
	    ...mapGetters(['account'])
  	},
	data(){
		return {
			canAdd:false,
			canEdit:false,
			canDelete:false,

			allAccounts: [],
			filterMethod(query, item) {
          		return item.pinyin.indexOf(query) > -1;
        	},
			departs: [],
			departList: [],
			listLoading: false,
			//下拉部门选择
			selectDeparts: [],

			addFormVisible: false,
			addLoading: false,
			addFormRules:{
				name:[
					{ required: true, message: '请输入部门名称', trigger: 'blur'}
				]
			},
			addForm:{},

			editFormVisible: false,
			editLoading: false,
			editFormRules:{
				name: [
					{ required: true, message: '请输入部门名称', trigger: 'blur'}
				]
			},
			editForm: {}
		}
	},
	methods:{
		setPermission(){
			const permissions = this.account.permissions;
			this.canAdd = util.hasPermission(permissions, 'department', '创建');
			this.canEdit = util.hasPermission(permissions, 'department', '编辑');
			this.canDelete = util.hasPermission(permissions, 'department', '删除');
		},
		handleChange(value, direction, movedKeys) {
        	console.log(value, direction, movedKeys);
      	},
		//获取所有用户
		listAccount(){
			listAccount().then((res)=>{
				this.allAccounts = res.result;
			}, (error)=>{
				console.log(error);
			})
		},
		getSelectDeparts(){
			const departs_ = util.sortTree(this.departs);
			departs_.splice(0, 0, {_id:'',name:'----'});
			return departs_;
		},
		//获取排序好后的列表
		getDepartList(){
			const departs_ = util.sortTree(this.departs);
			let temp = [];
			_.each(departs_, (m)=>{
				m.node = '---';
				temp.push(m);
				_.each(m.children, (n)=>{
					n.node = '|--';
					temp.push(n);
				})
			})
			return temp;
		},
		listDepartment(){
			this.listLoading = true;
			listDepartment().then((res)=>{
				this.listLoading = false;
				this.departs = res.result;
				this.selectDeparts = this.getSelectDeparts();
				this.departList = this.getDepartList();
			}, (error)=>{
				this.listLoading = false;
				this.$message.error(error);
			})
		},
		handleAdd(){
			this.addFormVisible = true;
			this.addForm = {
				name: '',
				parent: '',
				order: 1,
				accounts : []
			}
		},
		handleEdit(index, row){
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		handleDel(index, row){
			this.$confirm('确认删除该记录吗？', '提示', {}).then(()=>{
				removeDepartment(row._id).then((res)=>{
					this.$message.success(res.message);
					this.listDepartment();
				}, (error)=>{
					this.$message.error(error);
				})
			})
		},
		addSubmit(){
			this.$refs.addForm.validate((valid)=>{
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.addLoading = true;
				const para = Object.assign({}, this.addForm);
				addDepartment(para).then((res) => {
					this.addLoading = false;
					this.listDepartment();
					this.$message.success(res.message);
					this.addFormVisible = false;
				}, (error)=>{
					this.addLoading = false;
					this.$message.error(error);
				})
			})
		},
		editSubmit(){
			this.$refs.editForm.validate((valid) => {
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.editLoading = true;
				const para = Object.assign({}, this.editForm);
				editDepartment(para).then((res)=>{
					this.editLoading = false;
					this.listDepartment();
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
		this.setPermission();
		this.listDepartment();
		this.listAccount();
	}
}


</script>