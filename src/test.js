import './lib/imgui.umd.js';
import './lib/imgui_impl.umd.js';
import * as THREE from 'three'

(async function() {
  await ImGui.default();
  const canvas = document.querySelectorAll('canvas')[0];
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.scrollWidth * devicePixelRatio;
  canvas.height = canvas.scrollHeight * devicePixelRatio;
  window.addEventListener("resize", () => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.scrollWidth * devicePixelRatio;
    canvas.height = canvas.scrollHeight * devicePixelRatio;
  });

  ImGui.CreateContext();
  // ImGui_Impl.Init(canvas);

  ImGui.StyleColorsDark();
  //ImGui.StyleColorsClassic();

  const clear_color = new ImGui.ImVec4(0.3, 0.3, 0.3, 1.00);

  ImGui_Impl.Init(canvas);

  let done = false;
  window.requestAnimationFrame(_loop);
  function _loop(time) {
    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();

    ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);
    ImGui.SetNextWindowSize(new ImGui.ImVec2(294, 140), ImGui.Cond.FirstUseEver);
    ImGui.Begin("Debug");

    ImGui.ColorEdit4("clear color", clear_color);
    ImGui.Separator();
    ImGui.Text(`Scene: hey`);
    ImGui.Separator();
    ImGui.Text(`Material: lca`);
    ImGui.ColorEdit3("color",clear_color);
    const side_enums = [ 'FrontSide','BackSide','DoubleSide' ];
    const side_names = {};
    side_names[1] = "FrontSide";
    side_names[2] = "BackSide";
    side_names[3] = "DoubleSide"
    if (ImGui.BeginCombo("side", side_names['DoubleSide'])) {
      side_enums.forEach((side) => {
        const is_selected = (material.side === side);
        if (ImGui.Selectable(side_names[side], is_selected)) {
          material.side = side;
        }
        if (is_selected) {
          ImGui.SetItemDefaultFocus();
        }
      });
      ImGui.EndCombo();
    }
    ImGui.Separator();
    ImGui.Text(`Mesh: a`);
    ImGui.Checkbox("visible", (value) => console.log(value));
    ImGui.InputText("name", (value) => console.log(value));
    ImGui.SliderFloat3("position", 4, -100, 100);
    ImGui.SliderFloat3("rotation", 4, -360, 360);
    ImGui.SliderFloat3("scale", 4, -2, 2);

    ImGui.End();

    ImGui.EndFrame();

    ImGui.Render();


    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

    window.requestAnimationFrame(done ? _done : _loop);
  }

  function _done() {
    ImGui_Impl.Shutdown();
    ImGui.DestroyContext();
  }
})();

