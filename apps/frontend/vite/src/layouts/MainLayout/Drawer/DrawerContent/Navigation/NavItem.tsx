/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import PropTypes, { InferType } from 'prop-types';
import { forwardRef, Ref, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useRecoilState } from "recoil"
import { menuState } from "store/atoms"

// ==============================|| NAVIGATION - LIST ITEM ||============================== //
const NavItemPropTypes = {
  item: PropTypes.object,
  level: PropTypes.number
}
type NavItemTypes = InferType<typeof NavItemPropTypes>

const NavItem = ({ item, level }: NavItemTypes) => {
  const theme = useTheme();
  const [menu, setMenu] = useRecoilState(menuState)
  const location = useLocation()
  const { drawerOpen, openItem } = menu;

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef(
      (props, ref) =>
        <Link ref={ref as Ref<HTMLAnchorElement>} {...props} to={item.url} target={itemTarget} />
    )
  };
  if (item?.external) {
    // @ts-ignore
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const setOpenItem = (id: string) => {
    setMenu( (m) => ({
      ...m,
      openItem: [id]
      })
    )
  }

  const syncOpenItem = useCallback(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      setOpenItem(item.id)
    }
  }, [setOpenItem])

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

  const isSelected = openItem.findIndex((id) => id === item.id) > -1;

  useEffect(() => {
    syncOpenItem()
  }, [location]);

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => setOpenItem(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 28}px` : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        ...(drawerOpen && {
          '&:hover': {
            bgcolor: 'primary.lighter'
          },
          '&.Mui-selected': {
            bgcolor: 'primary.lighter',
            borderRight: `2px solid ${theme.palette.primary.main}`,
            color: iconSelectedColor,
            '&:hover': {
              color: iconSelectedColor,
              bgcolor: 'primary.lighter'
            }
          }
        }),
        ...(!drawerOpen && {
          '&:hover': {
            bgcolor: 'transparent'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent'
            },
            bgcolor: 'transparent'
          }
        })
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'secondary.lighter'
              }
            }),
            ...(!drawerOpen &&
              isSelected && {
                bgcolor: 'primary.lighter',
                '&:hover': {
                  bgcolor: 'primary.lighter'
                }
              })
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
              {item.title}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = NavItemPropTypes;

export default NavItem;
