import $ from "jquery";

// Hide menues after clicking outside
document.addEventListener("mouseup", function (event) {
  // Hide header profile dropdown menu
  if (!event.target.id.includes("header-profile")) {
    $(`#header-profile-menu`).removeClass("hidden").addClass("hidden");
  }

  // Hide table row menus
  if (
    !(
      event.target.id.includes("menu-button") ||
      event.target.id.includes("menu-td")
    )
  ) {
    if (!event.target.id.includes("menu-item")) {
      $(".row-menues").map((id) =>
        $(`#row-menu-${id}`).removeClass("hidden").addClass("hidden")
      );
    }
  }

  // Hide search dropdowns
  if (
    !(
      event.target.id.includes("dropDownInput") ||
      event.target.id.includes("inputDropDown")
    )
  ) {
    $("[name='inputDropDown']").removeClass("hidden").addClass("hidden");
  }

  if (event.target.id.includes("dropDownInput")) {
    Object.keys($("[name='inputDropDown']"))
      .splice(0, Object.keys($("[name='inputDropDown']")).length - 2)
      .map((i) => {
        const elementName = $("[name='inputDropDown']")[i].id.split("-")[1];
        if (elementName != event.target.name)
          $(`#inputDropDown-${elementName}`)
            .removeClass("hidden")
            .addClass("hidden");
      });
  }

  if (
    !(
      event.target.name == "mainMenuItem" ||
      event.target.name == "mainMenuMobileButton" ||
      event.target.getAttribute("name") == "mainMenuMobileButton"
    )
  ) {
    $("#mobile-menu-2").removeClass("hidden").addClass("hidden");
  }
});
