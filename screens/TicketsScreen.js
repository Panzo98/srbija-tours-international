import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { useFetchActions } from "../hooks/useFetchActions";
import Ticket from "../components/Ticket";
import * as SecureStore from "expo-secure-store";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const TicketsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const ticketsFromRedux = useSelector((state) => state.searchReducer.tickets);
  const loading = useSelector((state) => state.searchReducer.loading);
  const isConnected = useSelector((state) => state.connectionReducer.connected);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { getReservations } = useFetchActions();
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [storedTickets, setStoredTickets] = useState([]);
  const animatedValue = useState(new Animated.Value(0))[0];
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  useEffect(() => {
    loadStoredTickets();
  }, []);

  useEffect(() => {
    if (isAuthenticated && isConnected) {
      setActiveTab("all");
      setPage(1);
      dispatch({ type: "SET_LOADING" });
      getReservations(1).finally(() => {
        dispatch({ type: "DISABLE_LOADING" });
        setInitialLoad(false);
      });
    } else {
      setActiveTab("stored");
      dispatch({ type: "SET_LOADING" });
      loadStoredTickets().finally(() => dispatch({ type: "DISABLE_LOADING" }));
    }
  }, [isAuthenticated, isConnected]);

  useFocusEffect(
    useCallback(() => {
      const loadTickets = async () => {
        if (isConnected && isAuthenticated) {
          setActiveTab("all");
          setPage(1);
          dispatch({ type: "SET_LOADING" });
          await getReservations(1);
          dispatch({ type: "DISABLE_LOADING" });
          setInitialLoad(false);
        } else {
          setActiveTab("stored");
          dispatch({ type: "SET_LOADING" });
          await loadStoredTickets();
          dispatch({ type: "DISABLE_LOADING" });
        }
      };

      loadTickets();
    }, [isConnected, isAuthenticated])
  );

  const loadStoredTickets = async () => {
    try {
      const stored = await SecureStore.getItemAsync("tickets");
      if (stored !== null) {
        setStoredTickets(JSON.parse(stored));
      } else {
        setStoredTickets([]);
      }
    } catch (error) {
      console.log("Error loading stored tickets:", error);
    }
  };

  const loadMoreTickets = useCallback(async () => {
    if (
      loading ||
      (ticketsFromRedux &&
        ticketsFromRedux?.data?.length >= ticketsFromRedux?.total)
    )
      return;
    if (!refreshing) {
      dispatch({ type: "SET_LOADING" });
      await getReservations(page);
      setPage((prevPage) => prevPage + 1);
      dispatch({ type: "DISABLE_LOADING" });
    }
  }, [page, loading, ticketsFromRedux, refreshing]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshing(true);
    setPage(1);
    if (activeTab === "all" && isAuthenticated) {
      await getReservations(1);
    } else {
      await loadStoredTickets();
    }
    setIsRefreshing(false);
    setRefreshing(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <Text style={{ color: "#999" }}>Učitavanje</Text>
      </View>
    );
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    dispatch({ type: "SET_LOADING" });
    setActiveTab(tab);

    Animated.timing(animatedValue, {
      toValue: tab === "all" ? 0 : 1,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      if (tab === "all" && isAuthenticated) {
        getReservations(1).finally(() => dispatch({ type: "DISABLE_LOADING" }));
      } else {
        loadStoredTickets().finally(() =>
          dispatch({ type: "DISABLE_LOADING" })
        );
      }
    });
  };

  const allTicketsEmptyComponent = (
    <View style={styles.emptyContainer}>
      {loading ? null : (
        <Text style={[styles.emptyText]}>
          Nemate istoriju rezervacija!{"\n"}
          <Text
            style={{ color: "#188DFD", textDecorationLine: "underline" }}
            onPress={() => navigation.navigate("Home")}
          >
            Kliknite ovde da kupite kartu.
          </Text>
        </Text>
      )}
    </View>
  );

  const storedTicketsEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText]}>
        Niste preuzeli nijednu kartu!{"\n"}
      </Text>
    </View>
  );

  const ticketsData =
    activeTab === "all" ? ticketsFromRedux?.data || [] : storedTickets || [];

  return (
    <React.Fragment>
      {/* <StatusBar barStyle="light-content" backgroundColor="#188DFD" /> */}
      <SafeAreaView style={styles.safeArea} edges={["right", "left", "top"]}>
        <CustomScreenHeader title={"Pregled narudžbi"} />
        <View style={styles.tabsContainer}>
          {isConnected && isAuthenticated ? (
            <>
              <TouchableOpacity
                style={[styles.tab, activeTab === "all" && styles.activeTab]}
                onPress={() => handleTabChange("all")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "all" && styles.activeTabText,
                  ]}
                >
                  Sve karte
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "stored" && styles.activeTab]}
                onPress={() => handleTabChange("stored")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "stored" && styles.activeTabText,
                  ]}
                >
                  Preuzete karte
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.tab, styles.activeTab]}
              onPress={() => handleTabChange("stored")}
            >
              <Text style={[styles.tabText, styles.activeTabText]}>
                Preuzete karte
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.container}>
          <FlatList
            data={ticketsData}
            renderItem={({ item, index }) => (
              <View style={styles.ticketContainer}>
                <Ticket
                  ticket={item}
                  key={index}
                  activeTab={activeTab}
                  loadStoredTickets={loadStoredTickets}
                  isExpanded={expandedTicketId === item?.id_res}
                  onToggleExpand={(id) => setExpandedTicketId(id)}
                />
              </View>
            )}
            keyExtractor={(item, index) =>
              item?.id_res ? item.id_res?.toString() : index.toString()
            }
            ListEmptyComponent={
              activeTab === "all"
                ? allTicketsEmptyComponent
                : storedTicketsEmptyComponent
            }
            onEndReached={activeTab === "all" ? loadMoreTickets : null}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#188DFD"
                title="Povlačite za osvežavanje"
                titleColor="#188DFD"
              />
            }
          />
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#188DFD",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingVertical: screenHeight * 0.01,
    backgroundColor: "#f5f5f5",
  },
  tab: {
    paddingVertical: screenHeight * 0.012,
    paddingHorizontal: screenWidth * 0.05,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#188DFD",
    marginHorizontal: screenWidth * 0.02,
  },
  activeTab: {
    backgroundColor: "#188DFD",
  },
  tabText: {
    color: "#188DFD",
    fontSize: screenHeight * 0.016,
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.02,
    paddingTop: screenHeight * 0.01,
    backgroundColor: "#f5f5f5",
  },
  ticketContainer: {
    padding: screenHeight * 0.015,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: screenHeight * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: screenHeight * 0.02,
    marginTop: screenHeight * 0.02,
    textAlign: "center",
  },
  footer: {
    paddingVertical: screenHeight * 0.02,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TicketsScreen;
