import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;

const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const plans = [
  {
    title: "Yearly: 25$/Year",
    features: [
      { text: "Manual Detection", included: true },
      { text: "Auto Detection", included: true },
      { text: "Clear Analyze", included: true },
      { text: "Detection Record", included: true },
      { text: "Education Videos", included: true },
      { text: "Support 1 Device", included: true },
      { text: "Support 3 Devices", included: true },
    ],
    popular: true,
  },
  {
    title: "Yearly: 2.5$/Month",
    features: [
      { text: "Manual Detection", included: true },
      { text: "Auto Detection", included: true },
      { text: "Clear Analyze", included: true },
      { text: "Detection Record", included: true },
      { text: "Education Videos", included: true },
      { text: "Support 1 Device", included: true },
      { text: "Support 3 Devices", included: false },
    ],
    popular: false,
  },
  {
    title: "Free",
    price: "0$",
    period: "",
    features: [
      { text: "Manual Detection", included: true },
      { text: "Auto Detection", included: false },
      { text: "Clear Analyze", included: false },
      { text: "Detection Record", included: true },
      { text: "Education Videos", included: true },
      { text: "Support 1 Device", included: true },
      { text: "Support 3 Devices", included: false },
    ],
    popular: false,
  },
];

const PremiumScreen = () => {
  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Choose Your Plan</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {plans.map((plan, index) => (
          <View
            key={index}
            style={[styles.card, plan.popular && styles.mostPopularCard]}
          >
            {plan.popular && <Text style={styles.label}>Most Popular</Text>}
            <Text style={styles.title}>{plan.title}</Text>
            <Text style={styles.price}>
              {plan.price} {plan.period}
            </Text>

            <View style={styles.featureList}>
              {plan.features.map((feature, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.featureItem,
                    !feature.included && styles.disabledFeature,
                  ]}
                >
                  {feature.included ? "✅" : "❌"} {feature.text}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={plan.popular ? styles.upgradeButton : styles.selectButton}
            >
              <Text
                style={
                  plan.popular
                    ? styles.upgradeButtonText
                    : styles.selectButtonText
                }
              >
                {plan.popular ? "Upgrade Now" : "Select"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E4368",
    paddingTop: 60,
  },
  headerBox: {
    backgroundColor: "#1E4368",
    paddingVertical: verticalScale(20),
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  headerText: {
    color: "#fff",
    fontSize: moderateScale(40),
    fontWeight: "bold",
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    padding: moderateScale(20),
    paddingBottom: verticalScale(130),
    paddingTop: verticalScale(20),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(16),
    padding: moderateScale(40),
    width: "100%",
    marginBottom: verticalScale(30),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mostPopularCard: {
    borderWidth: moderateScale(2),
    borderColor: "#FFD700",
  },
  label: {
    position: "absolute",
    top: moderateScale(-10),
    left: moderateScale(10),
    backgroundColor: "#FFD700",
    color: "#000",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
    textAlign: "center",
  },
  price: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    marginBottom: verticalScale(10),
    textAlign: "center",
  },
  featureList: {
    marginVertical: verticalScale(10),
  },
  featureItem: {
    fontSize: moderateScale(25),
    marginBottom: verticalScale(6),
  },
  disabledFeature: {
    color: "#ccc",
  },
  upgradeButton: {
    backgroundColor: "#FFD700",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(10),
  },
  upgradeButtonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  selectButton: {
    backgroundColor: "#1E4368",
    borderWidth: moderateScale(2),
    borderColor: "#fff",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(10),
  },
  selectButtonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default PremiumScreen;
