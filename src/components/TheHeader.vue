<template>
  <!-- Use the imported ais_logo variable for the image source -->
  <header>

    <h1>Študent</h1>

    <div class="Student">

      <h2>Jakub V</h2>
      <div class="menu-icon">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </header>
</template>

<script>


export default {
  data() {
    return {

    };
  },
};
</script>

<style scoped>
/* Optional: Add some styling for the image */

.Student {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px;

}

.Student h2 {
  margin-right: 50px;
  /* Adds space between the icon and the text */
  padding: 10px;
  font-weight: bold;
  font-size: medium;
}


header {
  background-color: #0069C8;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  /* Align items vertically */
  justify-content: space-between;
  color: white;
  height: 60px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
}

.aisLogo img {
  width: 90px;
  /* Set the desired width */
  height: auto;
  /* Keep aspect ratio */

}

.profileIcon img {
  width: 30px;
  /* Set the desired width */
  /* Keep aspect ratio */
}

.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  margin-right: 10px;
}

.menu-icon .dot {
  width: 5px;
  height: 5px;
  background-color: white;
  border-radius: 40%;
}

h1 {
  font-weight: bold;
  padding: 0px;
  letter-spacing: -0.8px;
}
</style>