import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { formatPrice } from "../utils/formatPrice";
import { useAssets } from "expo-asset";

const { width, height } = Dimensions.get("window");

const PricesWithInfoCard = ({
  data,
  totalPrice,
  navigation,
  passCatPriceSr,
  selectedLine,
  setSelectedLine,
  index,
}) => {
  const dispatch = useDispatch();
  function formatTimeToHoursAndMinutesOnly(time) {
    const [hours, minutes] = time.split(":");
    const hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? "PM" : "AM";
    const formattedHours = hoursNum % 12 || 12;
    const formattedHoursStr = formattedHours.toString().padStart(2, "0");
    return `${formattedHoursStr}:${minutes} ${period}`;
  }

  const calculateTravellingTime = (
    departureTime,
    departureDay,
    arrivalTime,
    arrivalDay
  ) => {
    const departureDateTime = new Date(
      `2024-01-0${departureDay}T${departureTime}`
    );
    const arrivalDateTime = new Date(`2024-01-0${arrivalDay}T${arrivalTime}`);
    const timeDifference = arrivalDateTime - departureDateTime;
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const totalHours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${totalHours}:${remainingMinutes.toString().padStart(2, "0")} hrs`;
  };

  // const [assets] = useAssets([
  //   require("../assets/icons/arrow-down.png"),
  //   require("../assets/icons/electrical.png"),
  //   require("../assets/icons/toilet.png"),
  //   require("../assets/icons/wifi.png"),
  //   require("../assets/icons/bus.png"),
  // ]);
  useEffect(() => {
    if (index === 0) {
      setSelectedLine({
        id_departure: data.id_departure,
        totalPrice: totalPrice,
        passCatPriceSr: passCatPriceSr,
      });
    }
  }, []);

  const arrowDown = require("../assets/icons/arrow-down.png");
  const tempArrowDown =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAnCAYAAACFSPFPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEcSURBVHgB7Zc/S0JhFIdPBWaE0dLQ1tLW1NYQ+B1aW9oKGorSRURdnJz8NAqC+A38BDr6b3FwctHfwd/g4MEr99WrcB54EC/v633w/oEj4mzmQuKTgU9wBueSMK9wDF8kJucSH/137+ClxCRETDA8xsJjLDzGwmMsPMbCYyw8xsJjLDzGwmMsTjJGB7V72X3ou+G+oDGPsAlzMB1xj85RH7ABn6NsiBrTY8wng7YNbCmuLcAW7EtgUvzxCSzBKx7PwgU/lTTXTWFVAkyaFnoPFHmiMr9n12IyDNDZuwJvZc9owB8cwRp8Z8wbrMvqkvxy3UE44wk1qMOYNhzCf0nglXENf+CAMRqW5/HE+IJd+C1HgD49DxL9/ePszBLa8CdPOS4utwAAAABJRU5ErkJggg==";

  const electrical = require("../assets/icons/electrical.png");
  const tempElectrical =
    "data:image/png;base64,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";

  const toilet = require("../assets/icons/toilet.png");
  const tempToilet =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATpSURBVHgB5ZdtbFNlFMdvX/byYdOGDpmCk2EyRyQi+BIUK5Sk27otnYk4UKMENYxEQ6IY1MQloBiRaIKGLxMSNVFCGrVk0L122XRDiRFZTByjpUA2xqzGMLfCZrq2/g7cu9xdtnVZ+caTnJzznOec8z/Ped7uNSm61tDQcK/JZNqBuD6ZTCpms/mYxWLZ5XK5zimzaI2NjYvxfwXfl+nmIP88Pj6+s6Ki4gRyQm9r0gSfz2fLyspqxeACdFh0BNgIzQP82dLS0r9mAm1vb88eGxv7FHElCe/DLwq56K+ivw3/n/T2Vk3Izs7eALPEYrFaj8fTK7q2trZf6fsSicRTdD+fCRjQVSS8FNoKyEk1GT/6I/hvpDsJ2DwxdZPpQVgPhqGJQbN5AHaasRVKisbsFkJxu93+u6ZzOp3j6PyI9xnt9cB9sDttNtsCTReNRheQbRF0RknRSHIIlhWJRIp1yZiJuxqx32hv1clfQ9vYDDtaWlr2iiIej2+HLSLod0qKNjw83JWbm3uV/fBea2vrdpKNNjU1ySZ14b/lhkQ1gXXpx3gDGT4EYIgEQjgtE52MpQKurq7+12q1bsE/yb44SYzzAG5l6NW8vLwGo/21Xc0xug2QJRjacLwLsMUyYXT96C4hX0E+U15ePjwdcCAQkCVaAugiiYVsgQ/if56EIujP4f+fZm+lHPPI7n0MqgG1Ywy7fso0TvuHEn7T2dm50+FwXDaCNjc3FxL4K0TZhDkG/wTVG8B/t6I7GbLGtRgsB3D9yMhIFyWL64N6vV5LTk7OE4zvY7PVonrDAHoHFdrPuMxqRVVV1Vn9uHq+X2RyH/n9/l+4TLpFb8bhOYC/oAw/GEGliU7GsNuP3dPGcQIuZexxKvaOEVQaR2qMO8KL2IH/prq6uoxrwHTmQymvRLEBoGCKodWABsvKys5O5wv4EP5yKzoKCwvni84qawpPstZ7pE+AN/VOosfGol4Ek1ooFMoKh8MOxg7X19cXZ2RkJN1u96QzT6lto6OjxYD6sPsQ1TLo0sRxQpkP2Y3BRQ/Lm2omwWBQynw71JGZmfkxqmeMNqy7PBy7WZIC+I/wtaI3K+m1NQST8xthg8kN9ZvRgI0VhFmwexQbOc+PyfFNC1heLVgns/IQOIzcY7ThwblKRQKIz2NzHJ7Lnlg+Z2COxj0ELKZ0fxDITdCOvr6+galsqUgX4wXMWPAuIj85Z2CCVcB61Af+YZI4UlNTE5vKlrHTUJgEnVAXCXjmDMxMZafnAizlHmU3H5/OtqSk5G8AW7DfDMntZhHgC3Tc0P2aIUcgn7u3SJfxQvGH/6npCPQtdEJ8AT8qZtMBy8OB7VH5UMD+blRvyQXyASS31wOaIefubTbMazrfNTjIy/WupuC8D1KyPQQ8xdgxJUVj1nJVytJ4qU6bXBgHURzkQ+1LXYY2/QzoH8J4szEY5Y4xlo0YwF+ZRZNXLipCWsepsrLyIpV5iWBr6TpJohtZPvh2wWWGTjXx10XmlVqH/nvRWZU0mrqje1WSz1u5k7vVsSGq1CGVkCRE1vume3PNud3CwOp6mdRnUtHLxt+PmwpMk3e0iPd3E4CP6GXO66nZhVPkN2cltA7Kx/8F+Ah0ZSbgA+rN9Il8UQA2SH8vs+2lf0iZRcP2AH7yvySJX5ajBX3Geb/h6+R/hhqpfDPL860AAAAASUVORK5CYII=";

  const wifi = require("../assets/icons/wifi.png");
  const tempWifi =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATUSURBVHgB7ZZ7aJtVFMCTL2keNqlFaq0DN4pWVtHZbXRoVTAsS5O0RXwsiKATpHSCDNmYj3VKRYf4hxvWOXDgqypIi7Kmtmmjo5103cZkHVbcy2ztZrNs9RGSjzZN8/B3tq+w2cVGxL/shZNz73nfc885X3S6hbWw/qOl/yfCQ0ND1mg06tTr9Ss5lmWzWdE/C/xQXFz8bU1NzVS+tvJy3N3dvcRgMDTiqFFRFDWTyRyDHAUU4EagHJ6dgNrg7ayrqxv7V477+/stk5OTTpxt4xgGf4HhJ4Bmr9d7pLOzs9psNrtx2oHTVWAf2AZutVqtXzscjkRejnt7ex2g1SiWgQ2ABajlvDOdTr/f0NAw3tfX50mlUsPcKkJgZVNTUy4CKsJhFQGVILsGnSS0AfaSlTRwDtjn8XgGrnLc1dV1t8lkahElYB/wK4ZuglXK/m1u93lPT8+7pLuntrY2wH45/Fb474FfReYP9qeB1Jyb6fUKfLG1HLwfG5uwcUbv9/tLCgoKPoBRBHErgucSiUSJzWYLq6pqh6fOzMzYwNlYLBbx+XwqN7VxUweyu9Brhdc2ODg40dLSkvmrYynAQCBgB1eShRfQySK/ycjPU/DvhfGMy+XaL7chgHd4nwegRzg3o5Bxu91vzhqDp0KvROck8KnT6bygy/WWOALFgEM85XM8hz+ZTD4i0RyF2Eb+t7N/GSfR6enpTwhoK/SfwAHe90VJE+dyFJ/F2Fr2GwBzPB5/muzcTLAbrnSITgKdz7C3EbyYp3ySAH8j4OdhrzNCvB1Dx7XoajBcjrMRji8BB0nzBHgzvCjGzoNPYCyJnFHelNSnuUkp581aMV3UbKlAEBiXYrNYLEktphNAhRGGlc3jRHIefBjlKgw75G1YJcD9GJXDCLTrwTHOudrkK2Te0m7MNjvOJR5EJ05NKFpAMmQKFU0hrhGHQQYMu1C6ADYBq6GFMXCWgKqQeUhrt2utSkDaaQ2ydxiNRmmle5B3kznTlYKzjjtomWGER+VGnFeAvwcuSgY4jxFARDfPQn4Zb71FAFvrqRVrLlnpsRRGC+RAhKdA0sPXAYeAsDyFjMhQKPT7fI6xtQcbjwmg18z8Vq8RnNRGUmHzM9F9JBNJRhzKI5rAUeCkth9qamqamVUmENGT4ZO+6haKMkHlHhCg/Y5gb85A4e1vxUdIiutLNg3QzjDBVlD2H/IeQQSGpTowdgDad/AqkP0G6CWVYeQXAXvFGOcQY1TG7S9zUqoor4vI6OholAKW0VqHWb+em5bjZA+EwwjcBXG9vLdkALqH/aX+pMdb4QU4sw08DGmXVD/j77guj9Xe3m6y2+07sHEnvtbpNaPVEHbLl0UyQPSnuIWkUdpIPoOncRJBRj4ITs5e9lID7Xn4NCC3GLxW2pD9RvlYXHIsGSUNt2G0nmM1UKq7XPEmeEsQDpD+3bTUK9DsuTwgWwRaKh8GsExE6XeZ3zJSZUZ04FQKNvO332OCMYMaEXwDvJcsbJd5HgwGK5i3vvr6+m1axrzILMJwNdhHxl4rLCz8mOKK5rKd1z8QCmsVLbIFwzJMfiQzY+xXgneQvlvYP6o5DsCXz+jB+Wzm/Z+L4riB4liG8ftwslR3+TlkyZCRAhsgkGO00bz9vrD+H+tP9X6qLfxfqkcAAAAASUVORK5CYII=";

  const bus = require("../assets/icons/bus.png");
  const tempBus =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIDSURBVHgBrZQ9SFtRFMfvey8JCCF0aGtbKKR0KIXabp0cLKWQpIXSSqGTH5ugo+LgoCCibm4uoqiLRkVE80UyCIpEJIMfi4soGRQHIwQU8/Guvysanh9PgnrgcM89539/uefkvacJLB6PfywUCv2EFbhDlGdS07QjKWWH3+/f1lWmWCzWm6bZQ/IXwHYEBdJ7do5uwefzfb8806IYFyA2zwOBwBp+5nK53rDPkt61c13XP/BjMp1Ob7H3CEsbRiqVMiKRyA/i14gywLy2PUm5gbYmm82uoDVVTiPRzeYTxTn2VfimKM+qaW3ZMIzfnN1SN6om2GX14vMMbrEcChdQLdZw9lgxdPFEpkAe8XiTCjTFjJ6JB5o6iy85mEkf/Y7Q6wmJF3eJg8Ggkclkro2B+VTy/J0SHsPodFgKIWCtQH/eBJE33W73zdwRywDeXUqqG6k1Fou9TCQSlYg0YWOqFgqFXiWTSY/1bOm64XD4Pc/FZC6XGwL4zw5E7S8jGKPVOd7RqlJHFk0toEFekQZ6rxP21sgY/gMbROe/BaIQ5SltyufzEwiH7Sj82Dg+StjECz5Nq1Llr4adA/SOQhsQJ/EBvXttWKucVV8Azel0flb/thW0j38F8gVILfGsuMfQ/AEww8101kMraJ1kMwKDwg6fk677QNFo9C3LN/QVeK/KnQNVchI4kz2R4QAAAABJRU5ErkJggg==";
  const handleSelect = () => {
    setSelectedLine({
      id_departure: data.id_departure,
      totalPrice: totalPrice,
      passCatPriceSr: passCatPriceSr,
    });
    const updatedPassCatPriceSr = passCatPriceSr.map((passenger) => {
      return {
        ...passenger,
        firstName: "",
        lastName: "",
        phone: "",
        birthday: "",
        category: passenger.category,
        name: passenger.name,
        price_rsd: passenger.price_rsd,
      };
    });
    dispatch({
      type: "UPDATE_PASSENGERS_FULL_INFO",
      payload: updatedPassCatPriceSr,
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selectedLine?.id_departure === data.id_departure && styles.selectedCard,
      ]}
      onPress={handleSelect}
    >
      <View style={styles.scheduleContainer}>
        <View>
          <Text style={styles.time}>
            {formatTimeToHoursAndMinutesOnly(data.departure_time)}
          </Text>
          <Text style={styles.time}>
            {formatTimeToHoursAndMinutesOnly(data.arrival_time)}
          </Text>
        </View>

        <Image
          source={arrowDown}
          defaultSource={{ uri: tempArrowDown }}
          style={styles.arrow}
        />
        <View>
          <Text style={styles.station}>
            AS{" "}
            {data.fromCityName[0].toUpperCase() +
              data.fromCityName.substring(1)}
          </Text>
          <Text style={styles.station}>
            AS {data.toCityName[0].toUpperCase() + data.toCityName.substring(1)}
          </Text>
        </View>
      </View>
      <View style={styles.separatorLine}></View>
      <View style={styles.detailsContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.iconContainer}>
            <Image source={bus} defaultSource={{ uri: tempBus }} />
          </View>
          <Text style={styles.travelingTime}>
            {calculateTravellingTime(
              data.departure_time,
              data.departure_day,
              data.arrival_time,
              data.arrival_day
            )}
          </Text>
        </View>
        <View style={styles.iconsRow}>
          <Image
            style={{ marginHorizontal: 1 }}
            source={wifi}
            defaultSource={{ uri: tempWifi }}
          />
          <Image
            style={{ marginHorizontal: 1 }}
            source={electrical}
            defaultSource={{ uri: tempElectrical }}
          />
          <Image
            style={{ marginHorizontal: 1 }}
            source={toilet}
            defaultSource={{ uri: tempToilet }}
          />
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price} numberOfLines={2}>
            {formatPrice(totalPrice)} RSD
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    flexDirection: "column",
    borderRadius: 10,
    padding: height * 0.015,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
    marginBottom: height * 0.02,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: "#188DFD",
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  time: {
    fontSize: height * 0.02,
    fontWeight: "bold",
    paddingTop: height * 0.01,
  },
  station: {
    fontWeight: "bold",
    paddingTop: height * 0.01,
    fontSize: height * 0.02,
  },
  arrow: {
    padding: height * 0.01,
    alignSelf: "center",
    justifyContent: "center",
  },
  separatorLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#ADADAD",
    marginVertical: height * 0.01,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  infoContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  iconContainer: {
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.005,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ADADAD",
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: width * 0.05,
  },
  priceContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  price: {
    fontWeight: "bold",
    fontSize: height * 0.022,
    color: "#005b85",
  },
  travelingTime: {
    fontSize: height * 0.022,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: height * 0.01,
  },
});

export default PricesWithInfoCard;
