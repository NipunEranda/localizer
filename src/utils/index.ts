/* eslint-disable no-undef */

import $ from "jquery";
import getIcon from "./icons";
import { Response } from "@/models/Response";
import { ActionContext } from "vuex";
import { Alert } from "@/models/Alert";
import { State } from "@/store";
import { Ref } from "vue";

export { getIcon };

// export function formatDate(dateString: Date) {
//   dateString = dateString ? dateString : new Date();
//   return `${new Date(dateString).toLocaleDateString("en-CA")} ${new Date(
//     dateString
//   ).toLocaleTimeString()}`;
// }

export function showLoadingScreen() {
  // eslint-disable-next-line no-undef
  $("#loading-screen").removeClass("hidden").addClass("flex");
}

export function hideLoadingScreen() {
  // eslint-disable-next-line no-undef
  $("#loading-screen").removeClass("flex").addClass("hidden");
}

export function sort(
  event: { target: { attributes: { nodeValue: string }[] } },
  data: Ref
) {
  if (
    getSortDirection(event, data.value) == "unsorted" ||
    getSortDirection(event, data.value) == "descending"
  ) {
    data.value = data.value.sort(
      (a: { [x: string]: string }, b: { [x: string]: string }) =>
        (a[event.target.attributes[0]?.nodeValue]
          ? a[event.target.attributes[0]?.nodeValue]
          : ""
        ).localeCompare(
          b[event.target.attributes[0].nodeValue]
            ? b[event.target.attributes[0].nodeValue]
            : ""
        )
    );
  } else {
    data.value = data.value.sort(
      (a: { [x: string]: string }, b: { [x: string]: string }) =>
        (b[event.target.attributes[0].nodeValue]
          ? b[event.target.attributes[0].nodeValue]
          : ""
        ).localeCompare(
          a[event.target.attributes[0].nodeValue]
            ? a[event.target.attributes[0].nodeValue]
            : ""
        )
    );
  }
  return data.value;
}

export function getSortDirection(
  event: { target: { attributes: { nodeValue: string }[] } },
  arr: Array<{ [x: string]: string }>
) {
  const c = [];
  for (let i = 1; i < arr.length; i++) {
    c.push(
      (arr[i - 1][event.target.attributes[0].nodeValue]
        ? arr[i - 1][event.target.attributes[0].nodeValue]
        : ""
      ).localeCompare(
        arr[i][event.target.attributes[0].nodeValue]
          ? arr[i][event.target.attributes[0].nodeValue]
          : ""
      )
    );
  }

  if (c.every((n) => n <= 0)) return "ascending";
  if (c.every((n) => n >= 0)) return "descending";

  return "unsorted";
}

export function showModal(name: string) {
  $(`#${name}-modalOverlay`).removeClass("hidden");
}

export function hideModal(name: string) {
  $(`#${name}-modalOverlay`).addClass("hidden");
}

export function errorHandler(data: Response) {
  if (data.status == 403) $("#logout_modal").show();
  return data;
}

export function showAlert(context: ActionContext<Alert, State>) {
  // setTimeout(() => {}, 1000);
  setTimeout(() => {
    context.state.title = null;
    context.state.type = null;
    context.state.text = null;
  }, 5000);
}
