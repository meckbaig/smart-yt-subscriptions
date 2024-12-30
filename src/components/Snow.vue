<template>
    <div class="snow-container">
        <div v-for="i in snowflakeCount" 
             :key="i" 
             class="snowflake-wrapper" 
             :style="wrapperStyle()">
            <div class="snowflake" :style="flakeStyle()" v-html="particle"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    snowflakeCount: {
        type: Number,
        default: 50
    },
    speedMultiplier: {
        type: Number,
        default: 1
    },
    rotationSpeedMultiplier: {
        type: Number,
        default: 1
    },
    particle: {
        type: String,
        default: '❄'
    },
    minSize: {
        type: Number,
        default: 10
    },
    maxSize: {
        type: Number,
        default: 20
    },
    opacity: {
        type: Number,
        default: 0.8,
        validator: (value) => value >= 0 && value <= 1
    }
});

function wrapperStyle() {
    const startPosition = Math.random() * 100 + '%';
    const baseSpeed = Math.random() * 3 + 2;
    const fallDuration = (baseSpeed / props.speedMultiplier) + 's';
    const startDelay = Math.random() * (baseSpeed / props.speedMultiplier) * 5 + 's';
    
    return {
        left: startPosition,
        '--fall-duration': fallDuration,
        '--start-delay': startDelay,
        '--snow-opacity': props.opacity,
        animationDelay: startDelay
    };
}

function flakeStyle() {
    const size = Math.random() * (props.maxSize - props.minSize) + props.minSize + 'px';
    const rotationDirection = Math.random() > 0.5 ? 1 : -1;
    const rotationDuration = (Math.random() * 3 + 2) / props.rotationSpeedMultiplier + 's';
    
    return {
        fontSize: size,
        '--rotation-duration': rotationDuration,
        '--rotation-direction': rotationDirection,
        animationDelay: 'var(--start-delay)'
    };
}
</script>

<style scoped>
.snow-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.snowflake-wrapper {
    position: absolute;
    opacity: 0;
    animation: 
        fall var(--fall-duration) linear infinite,
        fadeIn 0.5s linear forwards;
    animation-delay: var(--start-delay), var(--start-delay);
}

.snowflake {
    /* color: white; */
    opacity: var(--snow-opacity);
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    animation: rotate var(--rotation-duration) linear infinite;
    animation-delay: var(--start-delay);
}

@keyframes fall {
    0% {
        transform: translateY(-100px);
    }
    100% {
        transform: translateY(100vh);
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(calc(360deg * var(--rotation-direction)));
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style> 