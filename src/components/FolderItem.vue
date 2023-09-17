<template>
    <router-link :to="{ name: 'folder', params: { folder: id } }"  v-bind:style="contrastColor(color)+'background-color:'+bgColor"
        v-bind:class="'d-flex flex-column position-relative rounded rounded-3 flex-fill border-'+borderThicness()+
        ' btn btn-outline-' + reverseTheme" @mouseover="bgColor = hoverColor(color)" @mouseleave="bgColor = color">
        <p class="text-start px-0 text-truncate w-100" style="margin-right: 40px;">{{ name }}</p>
        <router-link v-if="editable" class="top-0 end-0 to-show position-absolute p-0" style="margin:6px;width:28px;height:28px"
            :to="{ name: 'editFolder', params: { folder: id } }">
            <div class="position-relative btn btn-dark opacity-75 rounded-circle w-100 h-100 m-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="white"
                    class="bi bi-pencil position-absolute top-50 start-50 translate-middle m-0" viewBox="0 0 16 16">
                    <path
                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z">
                    </path>
                </svg>
            </div>
        </router-link>
        <img v-if="icon != ''" v-bind:src="icon"
                class="rounded rounded-3 mx-auto mb-1"
                style="max-height:80px;max-width:160px">
        <p class="text-start m-0 p-0 mt-auto" v-bind:style="'font-size: small;'+contrastColor(color)">
            Количество каналов: {{ channelsCount }}</p>
    </router-link>
</template>

<script setup>
import { ref } from 'vue'
import { contrastColor, hoverColor, reverseTheme } from "../main";
const bgColor = ref('')
bgColor.value = props.color

const props = defineProps({
    id: String,
    name: String,
    color: String,
    icon: String,
    channelsCount: String,
    editable: Boolean
})

function borderThicness(){
    if (props.color == "#ffffff" || props.color == "#212529"){
        return 1;
    }
    return 0;
}

</script>