import PaneLib from "react-split-pane/lib/Pane";
import SplitPaneLib from "react-split-pane";
import React from "react";

export const SplitPane = SplitPaneLib as unknown as React.FC<any>;
export const Pane = PaneLib as unknown as React.FC<any>;
