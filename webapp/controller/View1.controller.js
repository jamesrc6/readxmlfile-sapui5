sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("axelera.readxmlfile.controller.View1", {
            onInit: function (oEvent) {
                var oModel = new sap.ui.model.xml.XMLModel();
                //debugger
                oModel.loadData("model/SampleData.xml");

                this.getView().setModel(oModel);

                oModel.attachRequestCompleted(function (oEvent) {
                    sap.ui.getCore().setModel(oEvent.getSource());
                });

                setTimeout(() => {
                    // console.clear();
                    console.log(oModel.getData());
                }, 3000);
            },
            onInsert: function (oEvent) {
                //Create
                //debugger
                //var oModelData = this.getView().getModel().getData();

                var oModel = sap.ui.getCore().getModel();
                var oModelData = oModel.getData();
                var oRow = $(oModelData).find('Row')[0];
                var oNewChildNode = oModelData.createElement("Row");
                var oNodes = oRow.children;

                for (var i = 0; i < oNodes.length; i++) {
                    var oNodeName = oNodes[i].nodeName;
                    var xmlNode = oModelData.createElement(oNodeName);
                    xmlNode.appendChild(document.createTextNode(""));
                    oNewChildNode.appendChild(xmlNode);
                }

                var oRowset = $(oModelData).find('Rowset')[0];
                oRowset.appendChild(oNewChildNode);
                oModel.setData(oModelData);
                //this.getView().setModel(oModelData);
                var oTable = oEvent.getSource().getParent().getParent();
                jQuery.sap.delayedCall(100, null, function () {
                    var oLength = $(oModelData).find('Row').length;
                    var oItem = oTable.getItems()[oLength - 1];
                    var oCells = oItem.getCells();
                    for (var j = 0; j < oCells.length; j++) {
                        oCells[j].setEditable(true);
                    }
                });
            },
            onEdit: function (oEvent) {
                // Update
                var oTable = oEvent.getSource().getParent().getParent();
                var oSelectedItem = oTable.getSelectedItem();
                var oCells = oSelectedItem.getCells();
                for (var j = 0; j < oCells.length; j++) {
                    oCells[j].setEditable(true);
                }
            },
            onSave: function (oEvent) {
                //Save
                var oTable = oEvent.getSource().getParent().getParent();
                var oSelectedItem = oTable.getSelectedItem();
                if (oSelectedItem === null) {
                    var oModel = sap.ui.getCore().getModel();
                    var oModelData = oModel.getData();
                    var oLength = $(oModelData).find('Row').length;
                    var oItem = oTable.getItems()[oLength - 1];
                    var oCells = oItem.getCells();
                    for (var j = 0; j < oCells.length; j++) {
                        oCells[j].setEditable(false);
                    }
                } else {
                    var oSelectedCells = oSelectedItem.getCells();
                    for (var i = 0; i < oSelectedCells.length; i++) {
                        oSelectedCells[i].setEditable(false);
                    }
                }
                oTable.removeSelections(true);
                var oXMLData = (new XMLSerializer()).serializeToString(sap.ui.getCore().getModel().getData());
                var oTextArea = new sap.m.TextArea({
                    value: oXMLData,
                    editable: false,
                    width: "100%",
                    height: "200px"
                });
                var oDialog = new sap.m.Dialog({
                    title: "Data Response",
                    contentHeight: "200px",
                    content: [oTextArea],
                    endButton: new sap.m.Button({
                        text: "OK",
                        press: function () {
                            oDialog.close();
                        }
                    })
                });
                oDialog.open();
            },
            onDelete: function (oEvent) {
                //Delete
                var oTable = oEvent.getSource().getParent().getParent();
                var oSelectedItem = oTable.getSelectedItem();

                if (oSelectedItem === null) {
                    sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                        MessageBox.alert("Seleccione un elemento para eliminar", {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error"
                        });
                    });
                } else {
                    var that = this;
                    //console.log("that: ", that);
                    sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                        MessageBox.confirm("¿Estás segura de que quieres eliminar el elemento seleccionado?", {
                            icon: sap.m.MessageBox.Icon.WARNING,
                            title: "Delete",
                            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                            onClose: function (oEvent) {
                                that.fnCallbackConfirm(oEvent, oTable, oSelectedItem);
                            }
                        });
                    });
                }
            },
            fnCallbackConfirm: function (oEvent, oTable, oItem) {
                if (oEvent == "YES") {
                    var oIndex = oTable.indexOfItem(oItem);
                    var oModel = sap.ui.getCore().getModel();
                    var oModelData = oModel.getData();
                    var oRow = $(oModelData).find('Row')[oIndex];
                    var oRowset = $(oModelData).find('Rowset')[0];
                    oRowset.removeChild(oRow);
                    oModel.setData(oModelData);
                    oTable.removeSelections(true);
                } else {
                    oTable.removeSelections(true);
                    return false;
                }
            }
        });
    });
