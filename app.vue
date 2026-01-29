<template>
 
 <NuxtLayout >
    <NuxtPage /> 
    <WhatsAppButton/>
    <Chatbot/>
  </NuxtLayout > 
 
</template>  
  
<script setup>
import Chatbot from './components/Chatbot.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';

// No changes needed here
</script>
