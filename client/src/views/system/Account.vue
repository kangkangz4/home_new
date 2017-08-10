<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="listAccount">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="accounts" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="130" sortable>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="pinyin" label="拼音" width="120" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="180" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column label="操作" width="220">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button type="info" size="small" @click="handleResetPass(scope.row)">重置密码</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pagesize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-tabs v-model="editTabActiveName">
					<el-tab-pane label="基础信息" name="first"></el-tab-pane>
					<el-tab-pane label="附加信息" name="second"></el-tab-pane>
				</el-tabs>
				<div v-show="editTabActiveName == 'first'">
					<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editForm.mobile" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="name">
						<el-input v-model="editForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="拼音" prop="pinyin">
						<el-input v-model="editForm.pinyin" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="editForm.email" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div v-show="editTabActiveName == 'second'">
					<el-form-item label="头像">
						<el-upload
						  class="avatar-uploader"
						  action="/api/upload"
						  :show-file-list="false"
						  :on-success="handleEditFormAvatarSuccess"
						  :before-upload="beforeAvatarUpload">
						  <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="性别">
						<el-radio-group v-model="editForm.sex">
							<el-radio class="radio" :label="1">男</el-radio>
							<el-radio class="radio" :label="0">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="年龄">
						<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
					</el-form-item>
					<el-form-item label="生日">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
					</el-form-item>
					<el-form-item label="地址">
						<el-input type="textarea" v-model="editForm.addr"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-tabs v-model="addTabActiveName">
					<el-tab-pane label="基础信息" name="first"></el-tab-pane>
					<el-tab-pane label="附加信息" name="second"></el-tab-pane>
				</el-tabs>
				<div v-show="addTabActiveName == 'first'">
					<el-form-item label="手机号" prop="mobile">
					<el-input v-model="addForm.mobile" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="name">
						<el-input v-model="addForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="拼音" prop="pinyin">
						<el-input v-model="addForm.pinyin" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="addForm.email" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="addForm.password"></el-input>
					</el-form-item>
				</div>
				<div v-show="addTabActiveName == 'second'">
					<el-form-item label="头像">
						<el-upload
						  class="avatar-uploader"
						  action="/api/upload"
						  :show-file-list="false"
						  :on-success="handleAddFormAvatarSuccess"
						  :before-upload="beforeAvatarUpload">
						  <img v-if="addForm.avatar" :src="addForm.avatar" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="性别">
						<el-radio-group v-model="addForm.sex">
							<el-radio class="radio" :label="1">男</el-radio>
							<el-radio class="radio" :label="0">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="年龄">
						<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
					</el-form-item>
					<el-form-item label="生日">
						<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
					</el-form-item>
					<el-form-item label="地址">
						<el-input type="textarea" v-model="addForm.addr"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		
		<!-- 重置密码 -->
		<el-dialog title="重置密码" v-model="passFormVisible" :close-on-click-modal="false">
			<el-form :model="passForm" label-width="80px" :rules="passFormRules" ref="passForm">
				<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="passForm.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPass">
						<el-input type="password" v-model="passForm.confirmPass"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="passFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="passSubmit" :loading="passLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
import { listPageAccount, removeAccount, editAccount, addAccount, batchRemoveAccount, resetPass } from '../../api/api'

export default {
	data(){
		var validatePass = (rule, value, callback) => {
	        if (value === '') {
	          callback(new Error('请再次输入密码'));
	        } else if (value !== this.passForm.password) {
	          callback(new Error('两次输入密码不一致!'));
	        } else {
	          callback();
	        }
      	};
		return {
			filters:{
				name: ''
			},
			accounts:[],
			total: 0,
			page: 1,
			pagesize: 20,
			listLoading: false,
			sels:[],

			addFormVisible:false,//新增界面是否显示
			addLoading: false,
			addTabActiveName: 'first',
			addFormRules: {
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				pinyin: [
					{ required: true, message: '请输入拼音', trigger: 'blur' }
				],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' }
				],
				// sex: [
    //         		{ required: true, message: '请选择性别', trigger: 'change' }
    //       		],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			},
			//新增界面数据
			addForm: {},

			editFormVisible:false, //编辑界面是否显示
			editLoading: false,
			editTabActiveName: 'first',
			editFormRules: {
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				pinyin: [
					{ required: true, message: '请输入拼音', trigger: 'blur' }
				],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' }
				],
				// sex: [
    //         		{ required: true, message: '请选择性别', trigger: 'change' }
    //       		],
			},
			//编辑界面数据
			editForm:{},

			//重置密码界面
			passFormVisible:false,
			passLoading:false,
			passForm:{
				password: '',
				confirmPass: ''
			},
			passFormRules:{
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
				confirmPass:[
					{ required: true, validator: validatePass, trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		//性别显示转换
		formatSex(row, column) {
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
		},
		listAccount(){
			const para = {
				page: this.page,
				name: this.filters.name,
				pagesize: this.pagesize
			}
			this.listLoading = true;
			listPageAccount(para).then((res) => {
				this.listLoading = false;
				const result = res.result;
				this.accounts = result.accounts;
				this.total = result.total;
			}, (error)=>{
				this.$message.error(error);
			})
		},
		handleAdd(){
			this.addFormVisible = true;
			this.addForm = {
				mobile: '',
				name: '',
				pinyin: '',
				email: '',
				sex: -1,
				age: 0,
				birth: '',
				addr: '',
				passowrd: '',
				avatar:''
			};
			this.addTabActiveName = 'first';
		},
		//显示编辑界面
		handleEdit(index, row){
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
			this.editTabActiveName = 'first';
		},
		//删除
		handleDel(index, row){
			this.$confirm('确认删除该记录吗？','提示',{ type: 'warning'})
				.then(()=>{
					this.listLoading = true;
					removeAccount(row._id).then((res)=>{
						this.listLoading = false;
						this.$message.success(res.message);
						this.listAccount();
					}, (error)=>{
						this.listLoading = false;
						this.$message.error(error);
					})
				})
		},
		//重置密码
		handleResetPass(row){
			this.passFormVisible = true;
			this.passForm = {
				_id: row._id,
				password: '',
				confirmPass: ''
			}
		},
		//选择记录
		selsChange(sels){
			this.sels = sels;
		},
		//新增
		addSubmit(){
			this.$refs.addForm.validate((valid) => {
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.addLoading = true;
				let para = Object.assign({}, this.addForm);
				para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
				addAccount(para).then((res)=>{
					this.addLoading = false;
					this.$message.success(res.message);
					this.$refs['addForm'].resetFields();
					this.addFormVisible = false;
					this.listAccount();
				}, (error)=>{
					this.addLoading = false;
					this.$message.error(error);
				})
			})
		},
		//编辑
		editSubmit(){
			this.$refs.editForm.validate((valid) => {
				if(!valid){
					this.$message.error('请输入必填项');
					return;
				}
				this.editLoading = true;
				let para = Object.assign({}, this.editForm);
				para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
				editAccount(para).then((res)=>{
					this.editLoading = false;
					this.$message.success(res.message);
					this.$refs['editForm'].resetFields();
					this.editFormVisible = false;
					this.listAccount();
				}, (error)=>{
					this.editLoading = false;
					this.$message.error(error);
				})
			})
		},
		//批量删除
		batchRemove(){
			const ids = this.sels.map(item => item._id).toString();
			this.$confirm('确认删除选中记录吗？', '提示', {type:'warning'}).then(()=>{
				this.listLoading = true;
				let para = {ids:ids};
				batchRemoveAccount(para).then((res)=>{
					this.listLoading = false;
					this.$message.success(res.message);
					this.listAccount();
				}, (error)=>{
					this.listLoading = false;
					this.$message.error(error);
				})
			})
		},
		passSubmit(){
			const para = Object.assign({}, this.passForm);
			this.passLoading = true;
			resetPass(para).then((res)=>{
				this.passLoading = false;
				this.$message.success(res.message);
				this.passFormVisible = false;
			}, (error)=>{
				this.passLoading = false;
				this.$message.error(error);
			})
		},
		handleCurrentChange(val){
			this.page = val;
			this.listAccount();
		},
		handleAddFormAvatarSuccess(res, file) {
        	this.addForm.avatar = './uploads/' + res.filename;
		},
		handleEditFormAvatarSuccess(res, file){
			this.editForm.avatar = './uploads/' + res.filename;
		},
		beforeAvatarUpload(file) {
			let isFormat = false;
			if(file.type === 'image/jpeg' || file.type === 'image/png'){
				isFormat = true;
			}
			const isLt1M = file.size / 1024 / 1024 < 1;
			if (!isFormat) {
			  this.$message.error('上传头像图片只能是JPG或PNG格式!');
			}
			if (!isLt1M) {
			  this.$message.error('上传头像图片大小不能超过1MB!');
			}
			return isFormat && isLt1M;
		},
	},
	mounted(){
		this.listAccount();
	}
}

</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>