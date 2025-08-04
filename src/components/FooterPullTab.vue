<template>
    <div>
        <button>&triangleright;</button>
    </div>
</template>

<style scoped>
div {
    position: relative;

    @media screen and (width >= 1024px) {
        display: none;
    }
}

button {
    position: absolute;
    padding: 1rem 0;
    width: 2.5ch;
    right: -4.5ch;
}
</style>