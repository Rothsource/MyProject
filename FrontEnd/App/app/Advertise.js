import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;

const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const plans = [
  {
    title: "Yearly",
    price: "25$",
    period: "/Year",
    features: [
      { text: "Manual Detection", included: true },
      { text: "Auto Detection", included: true },
      { text: "Clear Analyze", included: true },
      { text: "Detection Record", included: true },
      { text: "Education Videos", included: true },
      { text: "Support 1 Devices", included: true },
      { text: "Support 3 Devices", included: true },
    ],
    popular: true, 
  },
  {
    title: "Monthly",
    price: "2.5$",
    period: "/Month",
    features: [
      { text: "Manual Detection", included: true },
      { text: "Auto Detection", included: true },
      { text: "Clear Analyze", included: true },
      { text: "Detection Record", included: true },
      { text: "Education Videos", included: true },
      { text: "Support 1 Device", included: true },
      { text: "Support 3 Devices", included: false },
    ],
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
  },
];

export default function PremiumPlans() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upgrade & Protect Smarter!</Text>
      <Text style={styles.subHeader}>
        Choose the plan that fits you best and unlock all premium features.
      </Text>

      <View style={styles.cardsContainer}>
        {plans.map((plan, index) => (
          <View
            key={index}
            style={[
              styles.card,
              plan.popular && styles.popularCard,
            ]}
          >
            {plan.popular && (
              <Text style={styles.popularTag}>Most Popular</Text>
            )}
            
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.price}>
              {plan.price}
              <Text style={styles.period}>{plan.period}</Text>
            </Text>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Ionicons
                    name={feature.included ? "checkmark-circle" : "close-circle"}
                    size={moderateScale(18)}
                    color={feature.included ? "#22C55E" : "#EF4444"}
                  />
                  <Text style={[
                    styles.featureText,
                    !feature.included && styles.disabledFeatureText
                  ]}>
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, plan.popular && styles.popularButton]}
            >
              <Text style={[
                styles.buttonText,
                plan.popular && styles.popularButtonText
              ]}>
                {plan.popular ? "Upgrade Now" : "Select"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingVertical: verticalScale(30),
    paddingHorizontal: scale(20),
    minHeight: verticalScale(600),
  },
  header: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#1E4368",
    textAlign: "center",
    marginBottom: verticalScale(10),
  },
  subHeader: {
    fontSize: moderateScale(16),
    color: "#666",
    textAlign: "center",
    marginBottom: verticalScale(30),
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(16),
    padding: scale(25),
    flex: 1,
    marginHorizontal: scale(8),
    minHeight: verticalScale(450),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    position: "relative",
    justifyContent: "space-between",
  },
  popularCard: {
    borderWidth: 2,
    borderColor: "#FFD700",
    backgroundColor: "#fff",
    transform: [{ scale: 1.05 }],
  },
  popularTag: {
    position: "absolute",
    top: moderateScale(-12),
    left: "50%",
    transform: [{ translateX: -50 }],
    backgroundColor: "#FFD700",
    color: "#000",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    textAlign: "center",
    zIndex: 1,
  },
  planTitle: {  
    fontSize: moderateScale(22),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: verticalScale(15),
    marginTop: verticalScale(10),
    color: "#1E4368",
  },
  price: {
    fontSize: moderateScale(26),
    textAlign: "center",
    marginBottom: verticalScale(25),
    fontWeight: "bold",
    color: "#333",
  },
  period: {
    fontSize: moderateScale(16),
    color: "#666",
  },
  featuresContainer: {
    flex: 1,
    justifyContent: "center",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  featureText: {
    marginLeft: scale(8),
    fontSize: moderateScale(15),
    color: "#333",
  },
  disabledFeatureText: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  button: {
    backgroundColor: "#1E4368",
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(20),
  },
  popularButton: {
    backgroundColor: "#FFD700",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  popularButtonText: {
    color: "#000",
  },
});