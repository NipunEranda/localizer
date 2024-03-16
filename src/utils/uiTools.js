import jQuery from "jquery";

// Hide menues after clicking outside
document.addEventListener("mouseup", function (event) {
  // Hide header profile dropdown menu
  if (!event.target.id.includes("header-profile")) {
    jQuery(`#header-profile-menu`).removeClass("hidden").addClass("hidden");
  }

  // Hide search dropdowns
  if (
    !(
      event.target.name == "dropDownInput" ||
      event.target.name == "inputDropDown"
    )
  ) {
    jQuery("[name='inputDropDown']").removeClass("hidden").addClass("hidden");
  }

  // Hide table row menus
  if (
    !(
      event.target.id.includes("menu-button") ||
      event.target.id.includes("menu-td")
    )
  ) {
    if (!event.target.id.includes("menu-item")) {
      jQuery(".row-menues").map((id) =>
        jQuery(`#row-menu-${id}`).removeClass("hidden").addClass("hidden")
      );
    }
  }
});
