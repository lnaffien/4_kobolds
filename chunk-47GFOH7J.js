import {
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-WODYBYGZ.js";

// src/app/pages/welcome/welcome.component.ts
var WelcomeComponent = class _WelcomeComponent {
  constructor() {
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function WelcomeComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _WelcomeComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WelcomeComponent, selectors: [["app-welcome"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 0, consts: [["id", "phaser-container"]], template: function WelcomeComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "p");
        \u0275\u0275text(1, "welcome works!");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "h1");
        \u0275\u0275text(3, "Test");
        \u0275\u0275elementEnd();
        \u0275\u0275element(4, "div", 0);
      }
    } });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WelcomeComponent, { className: "WelcomeComponent", filePath: "src\\app\\pages\\welcome\\welcome.component.ts", lineNumber: 9 });
})();

// src/app/pages/welcome/welcome.routes.ts
var WELCOME_ROUTES = [
  { path: "", component: WelcomeComponent }
];
export {
  WELCOME_ROUTES
};
//# sourceMappingURL=chunk-47GFOH7J.js.map
