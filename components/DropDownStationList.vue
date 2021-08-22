<template>
  <div class="dropdown">
    <button @click="isDropDown = !isDropDown" class="dropbtn">
      {{ selectedStation.name.toUpperCase() }}
    </button>
    <div v-show="isDropDown" class="dropdown-content">
      <div v-for="lang in languages" :key="lang.code">
        <a
          v-if="selectedStation.code != lang.code"
          @click="selectStation(lang)"
          >{{ lang.name.toUpperCase() }}</a
        >
      </div>
      <input
        type="text"
        placeholder="Search.."
        id="myInput"
        @keyup="filterFunction"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDropDown: false,
      selectedStation: { code: "all", name: "All Radio" },
      languages: [
        { code: "all", name: "All Radio" },
        { code: "en", name: "English" },
        { code: "ms", name: "Malay" },
        { code: "zh", name: "Chinese" },
        { code: "ta", name: "Tamil" },
      ],
    };
  },
  methods: {
    selectStation(val) {
      this.selectedStation = val;
      this.isDropDown = false;
    },
    filterFunction() {
      var input, filter, ul, li, a, i;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      div = document.getElementById("myDropdown");
      a = div.getElementsByTagName("a");
      for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          a[i].style.display = "";
        } else {
          a[i].style.display = "none";
        }
      }
    },
  },
};
</script>

<style scoped>
/* Dropdown Button */
.dropbtn {
  background-color: #04aa6d;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbtn:hover,
.dropbtn:focus {
  background-color: #3e8e41;
}

/* The search field */
#myInput {
  box-sizing: border-box;
  background-position: 14px 12px;
  background-repeat: no-repeat;
  font-size: 16px;
  padding: 14px 20px 12px 45px;
  border: none;
  border-bottom: 1px solid #ddd;
}

/* The search field when it gets focus/clicked on */
#myInput:focus {
  outline: 3px solid #ddd;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  position: absolute;
  background-color: #f6f6f6;
  min-width: 230px;
  border: 1px solid #ddd;
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #f1f1f1;
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display: block;
}
</style>