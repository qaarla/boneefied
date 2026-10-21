// Geometry check against React Native's actual bundled Yoga implementation.
// The measure callback models single-line fitting, not UIKit text rendering.
#include <yoga/Yoga.h>
#include <algorithm>
#include <cassert>
#include <cmath>
#include <iostream>

static YGSize measureTitle(YGNodeConstRef node, float width, YGMeasureMode mode,
                           float height, YGMeasureMode heightMode) {
  const float requested = *static_cast<const float*>(YGNodeGetContext(node));
  constexpr float wordEm = 4.222f;
  float fitted = requested;
  if (mode != YGMeasureModeUndefined) fitted = std::min(fitted, width / wordEm);
  if (heightMode != YGMeasureModeUndefined) fitted = std::min(fitted, height / 1.2f);
  assert(fitted >= requested * .1f);
  return {wordEm * fitted, fitted * 1.2f};
}

int main() {
  int cases = 0;
  for (float phone : {320, 360, 375, 390, 393, 402, 414, 430, 440}) {
    for (float preference : {.9f, 1.f, 1.12f}) {
      for (float system : {1.f, 1.15f, 1.3f, 1.5f, 1.8f, 2.f, 2.4f, 2.8f, 3.2f}) {
        auto row = YGNodeNew();
        YGNodeStyleSetWidth(row, phone - 40);
        YGNodeStyleSetFlexDirection(row, YGFlexDirectionRow);
        YGNodeStyleSetFlexWrap(row, YGWrapNoWrap);
        YGNodeStyleSetAlignItems(row, YGAlignCenter);
        YGNodeStyleSetGap(row, YGGutterColumn, 12);
        auto logo = YGNodeNew();
        auto title = YGNodeNew();
        auto settings = YGNodeNew();
        for (auto side : {logo, settings}) {
          YGNodeStyleSetWidth(side, 48);
          YGNodeStyleSetHeight(side, 48);
          YGNodeStyleSetFlexShrink(side, 0);
        }
        float font = 26 * preference * system;
        YGNodeSetContext(title, &font);
        YGNodeSetMeasureFunc(title, measureTitle);
        YGNodeStyleSetFlex(title, 1);
        YGNodeStyleSetFlexShrink(title, 1);
        YGNodeStyleSetMinWidth(title, 0);
        YGNodeStyleSetMaxHeight(title, 48);
        YGNodeInsertChild(row, logo, 0);
        YGNodeInsertChild(row, title, 1);
        YGNodeInsertChild(row, settings, 2);
        YGNodeCalculateLayout(row, YGUndefined, YGUndefined, YGDirectionLTR);
        auto center = [](YGNodeRef node) { return YGNodeLayoutGetLeft(node) + YGNodeLayoutGetWidth(node) / 2; };
        assert(std::abs(center(title) - YGNodeLayoutGetWidth(row) / 2) < .01f);
        assert(YGNodeLayoutGetLeft(title) >= 60);
        assert(YGNodeLayoutGetLeft(title) + YGNodeLayoutGetWidth(title) <= YGNodeLayoutGetLeft(settings) - 12 + .01f);
        assert(YGNodeLayoutGetHeight(row) == 48);
        assert(YGNodeLayoutGetTop(title) >= 0);
        assert(YGNodeLayoutGetTop(title) + YGNodeLayoutGetHeight(title) <= 48);
        YGNodeFreeRecursive(row);
        ++cases;
      }
    }
  }
  std::cout << "PASS: " << cases << " native Yoga phone-width / text-scale layouts\n";
}
