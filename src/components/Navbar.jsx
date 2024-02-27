import { Flex, IconButton, Link } from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import LogoEN from "./LogoEN";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateLanguage } from "../store/LngReducer";
import LogoAR from "./LogoAR";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { FocusLock, Button, FormLabel, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import useHistory hook
import { useMediaQuery } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

function Navbar() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.lang.lng);
  const navigateTo = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState(""); // State to store the tracking number

  const changeLanguage = () => {
    const newLanguage = currentLanguage === "ar" ? "en" : "ar";
    dispatch(updateLanguage(newLanguage));
    i18n.changeLanguage(newLanguage);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    // event.preventDefault();
    if (trackingNumber) {
      // Redirect to the URL with the tracking number as a query parameter
      navigateTo(`/?tracking=${trackingNumber}`);
    }
  };

  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");

  const { onWindowOpen, onWindowClose, isWindowOpen } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isLargerThan800 ? (
        <Flex
          w="100%"
          h="68px"
          fontWeight="bold"
          direction={currentLanguage === "ar" ? "row-reverse" : "row"}
          alignItems="center"
          justifyContent="space-between"
          padding={isLargerThan1200 ? "16px 70px" : "16px 50px"}
          borderBottom="1px solid"
          borderBottomColor="RGBA(0, 0, 0, 0.08)"
        >
          {currentLanguage === "ar" ? <LogoAR /> : <LogoEN />}
          <Flex
            gap={"50px"}
            direction={currentLanguage === "ar" ? "row-reverse" : "row"}
          >
            <Link _hover={{ color: "#e30613", textDecoration: "underline" }}>
              {t("الرئيسية")}
            </Link>
            <Link _hover={{ color: "#e30613", textDecoration: "underline" }}>
              {t("الأسعار")}
            </Link>
            <Link _hover={{ color: "#e30613", textDecoration: "underline" }}>
              {t("كلم المبيعات")}
            </Link>
          </Flex>
          <Flex
            gap={"50px"}
            direction={currentLanguage === "ar" ? "row-reverse" : "row"}
          >
            <Popover
              isWindowOpen={isWindowOpen}
              onWindowOpen={onWindowOpen}
              onWindowClose={onWindowClose}
              placement="right"
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <Link
                  _hover={{ color: "#e30613", textDecoration: "underline" }}
                >
                  {t("تتبع شحنتك")}
                </Link>
              </PopoverTrigger>
              <PopoverContent p={5}>
                <FocusLock returnFocus persistentFocus={false}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <form onSubmit={handleSubmit}>
                    <FormLabel textAlign="center">{t("تتبع شحنتك")}</FormLabel>
                    <Flex>
                      <Input
                        placeholder={t("رقم التتبع")}
                        id="tracking-number"
                        name="tracking-number"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)} // Update the tracking number state
                      />
                      <Button colorScheme="red" type="submit">
                        <SearchIcon />
                      </Button>
                    </Flex>
                  </form>
                </FocusLock>
              </PopoverContent>
            </Popover>

            <Link _hover={{ color: "#e30613", textDecoration: "underline" }}>
              {t("تسجيل الدخول")}
            </Link>
            <Link
              color="#e30613"
              _hover={{ textDecoration: "none", cursor: "pointer" }}
              onClick={changeLanguage}
            >
              {currentLanguage === "ar" ? "EN" : "AR"}
            </Link>
          </Flex>
        </Flex>
      ) : (
        <Flex
          w="100%"
          h="68px"
          direction={currentLanguage === "ar" ? "row-reverse" : "row"}
          alignItems="center"
          justifyContent="space-between"
          padding="16px 20px"
          borderBottom="1px solid"
          borderBottomColor="RGBA(0, 0, 0, 0.08)"
        >
          {currentLanguage === "ar" ? <LogoAR /> : <LogoEN />}
          <IconButton
            colorScheme="red"
            onClick={onOpen}
            icon={<HamburgerIcon />}
          />
          <Drawer onClose={onClose} isOpen={isOpen} size="full">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                {currentLanguage === "ar" ? <LogoAR /> : <LogoEN />}
              </DrawerHeader>
              <DrawerBody>
                <Flex direction="column" fontWeight="bold" fontSize="1.5rem">
                  <Link
                    _hover={{ color: "#e30613", textDecoration: "underline" }}
                  >
                    {t("الرئيسية")}
                  </Link>
                  <Link
                    _hover={{ color: "#e30613", textDecoration: "underline" }}
                  >
                    {t("الأسعار")}
                  </Link>
                  <Link
                    _hover={{ color: "#e30613", textDecoration: "underline" }}
                  >
                    {t("كلم المبيعات")}
                  </Link>
                  <Link
                    _hover={{ color: "#e30613", textDecoration: "underline" }}
                  >
                    {t("تسجيل الدخول")}
                  </Link>
                  <Link
                    color="#e30613"
                    _hover={{ textDecoration: "none", cursor: "pointer" }}
                    onClick={changeLanguage}
                  >
                    {currentLanguage === "ar" ? "EN" : "AR"}
                  </Link>
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      )}
    </>
  );
}

export default Navbar;
