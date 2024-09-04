<template>
  <el-popover placement="bottom" width="240px" trigger="hover" popper-class="icon-popover">
    <div>
      <testCard />

      <div class="group_20 flex-col" id="Block__77_45937" data-design="solid" style="box-sizing: border-box;width: 44.00px;height: 18.00px;border: 1px dashed rgb(252, 107, 32);;"></div>
      <span
        class="paragraph_1"
        id="Text__444444444444444444_32273"
        data-design="solid"
        style="box-sizing: border-box;width: 223.00px;height: 220.00px;overflow-wrap: break-word;color: rgba(0,12,1,1);font-size: 12.00px;font-family: MicrosoftYaHei;font-weight: normal;text-align: left;line-height: 22.00px;margin: 12px 0 0 8px"
      >
        <span style="margin-left: 46px;">印花线-橙色</span>
        <br />
        将背景图层延伸设计到此线条，以避免因设计未铺满生产区域导致实际生产效果出现边缘设计断层(留自或者留黑)，影响实物美观
        <br />
        注:
        <br />
        1.白色产品为黑色虚线，非自色产品为白色虚线;
        <br />
        2.设计全幅产品设计图需覆盖到印花线内全部区域。
        <br />
      </span>

      <img
        src="data:application/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAACCAYAAAFjxwOgAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAzKADAAQAAAABAAAAAgAAAABL9uogAAAAL0lEQVQ4EWN8+PBhPQMdACM9LKKLJXQILLAVw8oz9Ao0etgzGjH0COVRO4ZNCAAATBMPsBay12wAAAAASUVORK5CYII="
        alt=""
      />

      <div
        class="group_21 flex-col"
        id="Block__22226_99936"
        data-design="dashed"
        style="box-sizing: border-box; width: 44px; height: 18px; border: 1px solid rgb(16, 103, 238); display: flex; flex-direction: column; position: absolute;"
      ></div>
      <span
        class="paragraph_2"
        id="Text__11111111111111111_15553"
        data-design="solid"
        style="box-sizing: border-box;width: 222.00px;height: 112.00px;overflow-wrap: break-word;color: rgba(0,12,1,1);font-size: 12.00px;font-family: MicrosoftYaHei;font-weight: normal;text-align: left;line-height: 22.00px;margin: 8px 0 0 8px"
      >
        <span style="margin-left: 46px;">裁缝线</span>
        <br />
        实际生产需要裁切、缝合、包边的大概位置，设计时LOGO、图案和文字建议适当避开，否则可能造成图案不完整或实物效果偏差
      </span>
    </div>

    <template #reference>
      <conrner class="icon-container">
        <questionSvg />
        <div class="corner"></div>
      </conrner>
    </template>
  </el-popover>
</template>

<script setup>
import testCard from './testCard.vue';
import conrner from '@/views/designerApp/components/conrner.vue';
import questionSvg from '@/views/designerApp/components/svg/questionSvg.vue';
</script>

<style lang="less">
.icon-popover {
  width: 240px;
  //height: 510px;
  background: #fcfcfe;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}
</style>
<style scoped lang="less">
//icon
.icon-container {
  @size: 4rem;
  @gap: var(--fn-gap-min);
  //position: absolute;
  //right: calc((@size + @gap) * -1);
  width: @size;
  height: @size;
  background: #fcfcfe;
  border-radius: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #7e7e7e;

  &:hover {
    color: var(--fn-primary-color);
    opacity: 0.9;
    background-color: #fff9f5;
  }
}
</style>
