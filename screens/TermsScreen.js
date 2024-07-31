import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomScreenHeader from "../components/CustomScreenHeader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const TermsScreen = () => {
  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" backgroundColor="#188DFD" />
      <SafeAreaView style={styles.safeArea} edges={["right", "left", "top"]}>
        <View style={styles.headerContainer}>
          <CustomScreenHeader title={"Opšti uslovi prevoza"} />
        </View>
        <View style={styles.scrollContainer}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.contentContainer}>
              <Text style={styles.text}>
                Ovi Opšti uslovi prevoza su uslovi pod kojima Srbija Tours
                International d.o.o. prevozi sva lica i njihovu imovinu, i ovi
                uslovi će se primenjivati na svaku kartu koju izda Srbija Tours
                International, kao i na svaki ugovor o prevozu bilo kog lica
                koji sklopi Srbija Tours International. Za svakog putnika koji
                koristi usluge Srbija Tours International biće smatrano da je
                saglasan sa prevozom u skladu sa ovim Opštim uslovima prevoza.
              </Text>
              <Text style={styles.heading}>Posebne napomene</Text>
              <Text style={styles.text}>
                Karte kupljene od drugih operatora: Skrećemo Vam pažnju da
                ukoliko ste kupili bilo koju kartu koja Vam daje pravo na
                putujete na bilo koji od naših linija, ali tu kartu nismo izdali
                mi, niti naš agent, onda morate sve žalbe ili reklamacije
                dostaviti operatoru od koga ste kupili svoju kartu, budući da
                ćemo Vas mi prevoziti kao podugovarača tog operatora i nećemo sa
                Vama imati sklopljen ugovor.
              </Text>
              <Text style={styles.heading}>Pregled dodatnih naknada</Text>
              <Text style={styles.text}>
                Skrećemo Vam pažnju da ćemo naplaćivati dodatne naknade na
                objavljenju cenu karte. Trenutne tarife po osobi za ove naknade
                su sledeće: TRENUTNO NEMA NAKNADA
              </Text>
              <Text style={styles.heading}>Vaša karta</Text>
              <Text style={styles.text}>
                Vaša karta predstavlja dokaz našeg ugovora da prevezemo Vas ili
                da se pobrinemo o Vašem prevozu. Vaša karta je naše vlasništvo i
                na zahtev se nam biti vraćena. Ukoliko je vašu kartu kupio neko
                drugi, bićete saglasni da je osoba koja je kupila kartu kao Vaš
                agent. Kartu može koristiti samo jedno lice čije je ime navedeno
                na istoj ili za koja je karta kupljena, a ne može se preneti
                niti je može koristiti bilo koje drugo lice. Vaša karta mora
                sadržati Vaše puno ime, inače neće biti važeća za putovanje.
              </Text>
              <Text style={styles.heading}>Prtljag</Text>
              <Text style={styles.text}>
                Izvršićemo prevoz Vašeg prtljaga u skladu sa ovim Opštim
                uslovima prevoza i bilo kojim važećim Posebnim uslovima. Imate
                pravo da unesete u autobus jedan ili dva srednje veličine kofera
                (maksimalnih dimenzija 30 x 70 x 20cm i 30kg težine), i jedan
                mali ručni prtljag. Dozvoljeni prtljag varira u zavisnosti od
                autobusa. U ovom slučaju, ručni prtljag znači nešto što se može
                smestiti u prtljažni deo iznad sedišta ili ispod sedišta.
              </Text>
            </View>
          </ScrollView>
          <View style={styles.bottomPadding} />
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
  headerContainer: {
    backgroundColor: "#188DFD",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F5F4F4",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.02,
    paddingBottom: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: screenHeight * 0.028,
    fontWeight: "bold",
    marginTop: screenHeight * 0.03,
    marginBottom: screenHeight * 0.015,
  },
  heading: {
    fontSize: screenHeight * 0.025,
    fontWeight: "bold",
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.01,
  },
  text: {
    fontSize: screenHeight * 0.022,
    marginBottom: screenHeight * 0.015,
    textAlign: "justify",
  },
  bottomPadding: {
    // height: screenHeight * 0.05,
    backgroundColor: "#fff",
  },
});

export default TermsScreen;
