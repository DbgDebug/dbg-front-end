<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">
        <el-col
          :span="12"
          :xs="24"
        >
          <el-table
            :data="productList"
            style="width: 100%"
          >
            <el-table-column
              label="商品名称"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="购买数量"
              align="center"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  size="mini"
                  :min="1"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template v-slot="{row}">
                <el-button
                  type="primary"
                  size="mini"
                  @click="addToCard(row)"
                >
                  加入购物车
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col
          :span="12"
          :xs="24"
        >
          <el-table
            :data="shoppingCart"
            style="width: 100%"
          >
            <el-table-column
              label="商品名称"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="购买数量"
              align="center"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  size="mini"
                  :min="0"
                  @change="quantityUpdate"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
            >
              <template v-slot="{row}">
                {{ towFloor(row) }}
              </template>
            </el-table-column>
          </el-table>
          <div
            style="margin-top: 10px;"
          >
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <label>总金额：{{ totalAmount }}</label>
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 10px">
            <el-button
              type="primary"
              size="mini"
              @click="submitOrder()"
            >
              提交订单
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="testA()"
            >
              支付订单
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-dialog
        title="支付订单"
        :visible.sync="dialogFormVisible"
      >
        <div
          id="qrcodejs2"
          ref="qrcodejs2"
          style="width: 150px;height: 150px;margin:auto"
        />
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getProductList, createOrder, defaultOrderForm,
  defaultProductForm, defaultOrder, payQRCode, defaultPayQRCode
} from '@/api/pay'
import { Product, Order, OrderForm, ProductForm, PayQRCode } from '@/api/types'

@Component({
  name: 'PayTest'
})
export default class extends Vue {
  private productList: Product[] = []
  private shoppingCart: Product[] = []
  private shoppingCartMap = new Map()
  private orderForm: OrderForm = defaultOrderForm
  private productForm: ProductForm = defaultProductForm
  private orderProductList: ProductForm[] = []
  private order: Order = defaultOrder
  private payCode: PayQRCode = defaultPayQRCode
  private orderAmount = 0
  private paymentWay = [{ label: '支付宝', value: 'alipay' }]
  private createPayment = { paymentWay: '支付宝', orderId: 0 }
  private dialogFormVisible = false

  private rules = {
    paymentWay: [{ required: true, message: '', trigger: 'change' }],
    orderId: [{ required: true, message: '', trigger: 'change' }]
  }

  get totalAmount(): number {
    return this.orderAmount
  }

  set totalAmount(val: number) {
    this.orderAmount = val
  }

  private async testA() {
    // const { data } = await payTest({ id: 123 })
    // console.log(data)
    await this.getQRCode()
    this.dialogFormVisible = true
    setTimeout(() => {
      this.qrCode(this.payCode.qrCodeUrl)
      // this.qrCode('http://localhost/')
    }, 500)
  }

  created() {
    this.getProductList()
  }

  private async getProductList() {
    const { data } = await getProductList()
    this.productList = data
  }

  private quantityUpdate() {
    this.amountSum()
  }

  private addToCard(product: Product) {
    if (product.quantity <= 0) {
      product.quantity = 1
    }

    for (let i = 0; i < this.shoppingCart.length; i++) {
      if (this.shoppingCart[i].productId === product.productId) {
        this.shoppingCart[i].quantity += product.quantity
        this.amountSum()
        return
      }
    }

    const productTemp: Product = {
      productId: product.productId,
      productName: product.productName,
      quantity: product.quantity,
      price: product.price
    }
    this.shoppingCart.push(productTemp)
    this.amountSum()
  }

  private amountSum() {
    let sum = 0
    for (let i = 0; i < this.shoppingCart.length; i++) {
      sum = sum + this.shoppingCart[i].price * this.shoppingCart[i].quantity
    }
    this.totalAmount = sum
  }

  private async submitOrder() {
    if (this.payCode.qrCodeUrl !== '') {
      this.$message({
        message: '存在未支付订单',
        type: 'error'
      })
      return
    }
    this.orderProductList = []
    for (let i = 0; i < this.shoppingCart.length; i++) {
      const productForm: ProductForm = {
        productId: this.shoppingCart[i].productId,
        quantity: this.shoppingCart[i].quantity
      }
      this.orderProductList.push(productForm)
    }
    this.orderForm.productList = this.orderProductList
    const { data } = await createOrder(this.orderForm)
    this.order = data
  }

  public async getQRCode() {
    const params = { paymentWay: 'alipay', orderId: this.order.orderId }
    const { data } = await payQRCode(params)
    this.payCode = data
  }

  private QRCode: any
  private qrcodeA: any
  private isCode = true
  private qrCode(url: string): void {
    if (this.isCode) {
      this.isCode = false
      this.qrcodeA = new this.QRCode('qrcodejs2', {
        width: 150, // 图像宽度
        height: 150, // 图像高度
        colorDark: '#000000', // 前景色
        colorLight: '#ffffff', // 背景色
        typeNumber: 4,
        correctLevel: this.QRCode.CorrectLevel.H // 容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      })
    }
    this.qrcodeA.clear() // 清除二维码
    this.qrcodeA.makeCode(url) // 生成另一个新的二维码
  }

  private towFloor(product: Product) {
    const num = product.price * product.quantity
    return num.toFixed(2)
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
